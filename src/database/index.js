import { db, auth } from '../firebase'
import moment from 'moment'
import Swal from 'sweetalert2'
export const setEvent = async (data, institution) => {
    let ref = await db.collection("events").orderBy("code", "desc").limit(1).get();
    var lastCode = parseInt(ref.docs[0].id) + 1
    let lastCodePadded = lastCode.pad(4)
    const dataFormated = {
        ...data,
        time: moment(data.time).format('HH:mm'),
        date: moment(data.date).format('DD-MM-YYYY'),
        institutionName: institution.institutionName,
        creator_id: institution.creator_id,
        creator_email: institution.email,
        cupos_disponibles: data.cupos,
        cupos_ocupados: 0,
        code: lastCodePadded
    }
    console.log(dataFormated);
    await db.collection('events').doc(lastCodePadded).set(dataFormated)
}

export const getEvents = async (email) => {
    let events = await db.collection('events').where('subscriptors', 'array-contains', email).get()
    let dataEvents = []
    events.forEach((ev) => {
        const data = ev.data()
        dataEvents.push(data)
    })
    return dataEvents
}

export const getEventsToInstitution = (email) => {
    return (dispatch) => {
        db.collection('events').where('creator_email', '==', email).get()
            .then((events) => {
                let dataEvents = []
                events.forEach((ev) => {
                    const data = ev.data()
                    dataEvents.push(data)
                })
                dispatch({ type: 'GET_EVENTS', payload: dataEvents })
            })
    }
}

export const createInstitution = async (data) => {
    const { institutionName, email, pass, address, repeatPass } = data
    if (pass !== repeatPass) {
        await Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
        return null
    } else {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(async () => {
                await db.collection('users').doc(email).set({ institutionName, address, email, type: 'institution' })
                await Swal.fire('Éxito', 'usuario creado', "success")
                window.location.reload()
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') Swal.fire('Error', 'El usuario ya esta en uso', "error")
                else {
                    Swal.fire('Error', 'Por favor intente nuevamente', "error")
                }
            })
    }
}

export const createUser = async (data) => {
    const { name, email, dni, pass, tel, repeatPass } = data
    if (pass !== repeatPass) {
        await Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
        return null
    } else {

        let newEmail = `${dni.replace(/\./g, '')}@reservip.com`
        auth.createUserWithEmailAndPassword(newEmail, pass)
            .then(async () => {
                await db.collection('users').doc(dni).set({ name, dni, tel, email, type: 'person', institution_subscribed: [] })
                await Swal.fire('Éxito', 'usuario creado', "success")
                window.location.reload()
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') Swal.fire('Error', 'El usuario ya esta en uso', "error")
                else {
                    Swal.fire('Error', 'Por favor intente nuevamente', "error")
                }
            })
    }
}

export const authenticate = async (data) => {
    const { DNI, pass } = data
    let userLoged = false
    let newEmail = DNI;
    if (!DNI.includes('@')) {
        newEmail = `${DNI.replace(/\./g, '')}@reservip.com`
    }
    await auth.signInWithEmailAndPassword(newEmail, pass)
        .then(async () => {
            let user;
            if (!DNI.includes('@')) {
                user = await db.collection('users').doc(DNI.replace(/\./g, '')).get()
            } else {
                user = await db.collection('users').doc(DNI).get()
            }
            userLoged = user.data();
        })
        .catch((err) => {
            console.log(err);
            Swal.fire('Error', 'Por favor verifique las credenciales e intente nuevamente', 'error')
        })
    return userLoged
}

export const subscribeEventQuery = async (code, user) => {
    let ref = db.collection('events').doc(code)
    let event = await ref.get()
    let operation = false
    if (!event.exists) {
        console.log('no existe');
    } else {
        await ref.update(`subscriptors.${user.tel}`, user)
        operation = true
    }
    return operation;
}

export const subscribeInstitutionQuery = async (code, user) => {
    let institution = await db.collection('users').where('creator_id', '==', code.toUpperCase()).get()
    if (institution.docs.length > 0) {
        try {
            institution = institution.docs[0].data()
            let userFromFirebase = await db.collection('users').doc(user.dni).get()
            let { institution_subscribed } = userFromFirebase.data()
            institution_subscribed.push(institution.email)
            await db.collection('users').doc(user.dni).update(`institution_subscribed`, institution_subscribed)
            return institution.institutionName
        } catch (error) {
            console.log(error);
        }
    } else {
        return false
    }
}

export const getEventsByInstitution = (email) => {
    return (dispatch) => {
        function getData(snap) {
            return snap.docs.map(el => el.data())
        }
        db.collection('events')
            .where('creator_email', '==', email[0])
            .onSnapshot((snap) => {
                let data = getData(snap)
                dispatch({ type: 'GET_EVENTS', payload: data })
            })
    }
}

export const getUserByDNI = (dni) => {
    return (dispatch) => {
        db.collection('users').doc(dni).get()
            .then((user) => {
                dispatch({ type: 'LOGGED', payload: user.data() })
            })
    }
}

export const getEventByCode = (code) => {
    return (dispatch) => {
        db.collection('events').doc(code).get()
            .then((dataEvent) => {
                dispatch({ type: 'GET_EVENTINFO', payload: dataEvent.data() })
            })
    }
}

export const SubscribeEvent = async (data) => {
    let respuesta = false
    try {
        await db.collection(`events/${data.eventInfo.code}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY') })
        await db.collection(`users/${data.registeredFor.dni}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY') })
        const res = await db.doc(`events/${data.eventInfo.code}`).get()
        let { cupos_disponibles, cupos_ocupados } = res.data()
        if (data.type === 'family') {
            await db.doc(`events/${data.eventInfo.code}`).update({ cupos_disponibles: parseInt(cupos_disponibles) - parseInt(data.integrants_number), cupos_ocupados: parseInt(cupos_ocupados) + parseInt(data.integrants_number) })
        } else {
            await db.doc(`events/${data.eventInfo.code}`).update({ cupos_disponibles: parseInt(cupos_disponibles) - 1, cupos_ocupados: parseInt(cupos_ocupados) + 1 })
        }
        respuesta = true
    } catch (error) {
        console.log(error);
    }
    return respuesta
}

export const getReservesToUser = async (dni) => {
    try {
        const res = await db.collection(`users/${dni}/reservas`).get()
        let reservas = res.docs.map(el => {
            return { ...el.data(), id: el.id }
        })
        console.log(reservas);
        return reservas
    } catch (error) {
        Swal.fire('Error!', 'Por favor intente nuevamente', 'error')
        console.log(error);
    }
}

export const getReservInfo = async (id, dni) => {
    try {
        const res = await db.doc(`users/${dni}/reservas/${id}`).get()
        let reservInfo = res.data()
        return reservInfo
    } catch (err) {
        console.log(err);
    }
}