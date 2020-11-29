import { db, auth } from '../firebase'
import moment from 'moment'
import Swal from 'sweetalert2'

export const setEvent = async (data, institution) => {
    let respuesta = false
    try {
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
        await db.collection('events').doc(lastCodePadded).set(dataFormated)
        respuesta = true
    } catch (error) {
        console.log(error);
        Swal.fire('Error', error.message, 'error')
    }
    return respuesta
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
        db.collection('events').where('creator_email', '==', email).orderBy('date', 'asc').get()
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
    const { name, email, dni, tel } = data
    if (dni.length < 6) {
        await Swal.fire('Error', 'Coloca el DNI completo por favor', 'error')
        return null
    } else {
        let newEmail = `${dni.replace(/\./g, '')}@reservip.com`
        auth.createUserWithEmailAndPassword(newEmail, dni)
            .then(async () => {
                await db.collection('users').doc(dni).set({ name, dni, tel, email, type: 'person', institution_subscribed: ['comunidadcristianadontorcuato@gmail.com'] })
                await Swal.fire('Éxito', 'usuario creado', "success")
                window.location.reload()
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') Swal.fire('Error', 'El usuario ya esta en uso', "error")
                if (err.code === 'auth/weak-password') Swal.fire('Error!', 'La contraseña debe ser mayor a 6 caracteres', 'error')
                else {
                    Swal.fire('Error', 'Por favor intente nuevamente', "error")
                    console.log(err);
                }
            })
    }
}

export const authenticate = async (data) => {
    let { DNI, pass } = data
    let userLoged = false
    let newEmail = DNI;
    if (!DNI.includes('@')) {
        newEmail = `${DNI.replace(/\./g, '')}@reservip.com`
        pass = DNI
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
        Swal.fire('Error!', 'Este codigo es invalido', 'error')
    } else {
        await ref.update(`subscriptors.${user.tel}`, user)
        operation = true
    }
    return operation;
}

// const restoreUsers = async () => {
//     let res = await db.collection('users').get()
//     res.forEach((snap) => {
//         let us = snap.data()
//         if (us.type === 'person') {
//             let newEmail = `${us.dni.replace(/\./g, '')}@reservip.com`
//             auth.createUserWithEmailAndPassword(newEmail, us.dni)
//                 .then(() => console.log(us.dni, 'creado!'))
//                 .catch('error = ', us.dni)
//         }

//     })
// }
// restoreUsers()

export const subscribeInstitutionQuery = async (code, user) => {
    let institution = await db.collection('users').where('creator_id', '==', code.toUpperCase()).get()
    try {
        if (institution.empty) throw `El código ingresado es incorrecto`
        institution = institution.docs[0].data()
        let userFromFirebase = await db.collection('users').doc(user.dni).get()
        let { institution_subscribed } = userFromFirebase.data()
        if (institution_subscribed.includes(institution.email)) throw `Ya esta registrado a ${institution.institutionName}`
        institution_subscribed.push(institution.email)
        await db.collection('users').doc(user.dni).update(`institution_subscribed`, institution_subscribed)
        return institution.institutionName
    } catch (error) {
        console.log(error);
        await Swal.fire('Error!', error, 'error')
    }
}

export const getEventsByInstitution = (email) => {
    return (dispatch) => {
        function getData(snap) {
            return snap.docs.map(el => el.data())
        }
        db.collection('events')
            .where('date', '>=', moment().format('DD-MM-YYYY'))
            .orderBy("date", "asc")
            .get()
            .then((snap) => {
                let data = getData(snap)
                dispatch({ type: 'GET_EVENTS', payload: data })
            })
            .catch((err) => console.log(err))
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
        if (data.cupos_reservados > data.eventInfo.cupos_disponibles) throw `Solo quedan ${data.eventInfo.cupos_disponibles} cupos disponibles.`
        if (data.type === 'me' || data.type === 'family') {
            let res = await db.collection(`users/${data.registeredFor.dni}/reservas`).where('eventInfo.code', '==', data.eventInfo.code).get()
            if (!res.empty) throw 'Ya tiene un cupo reservado para este evento'
        }
        let reservaId = moment().format('YYYYMMDDHHmmss')
        await db.collection(`events/${data.eventInfo.code}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY'), reservaId: reservaId })
        await db.collection(`users/${data.registeredFor.dni}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY'), reservaId: reservaId })
        const res = await db.doc(`events/${data.eventInfo.code}`).get()
        let { cupos_disponibles, cupos_ocupados } = res.data()
        if (data.type === 'family') {
            await db.doc(`events/${data.eventInfo.code}`).update({ cupos_disponibles: parseInt(cupos_disponibles) - parseInt(data.integrants_number), cupos_ocupados: parseInt(cupos_ocupados) + parseInt(data.integrants_number) })
        } else {
            await db.doc(`events/${data.eventInfo.code}`).update({ cupos_disponibles: parseInt(cupos_disponibles) - 1, cupos_ocupados: parseInt(cupos_ocupados) + 1 })
        }
        respuesta = true
    } catch (error) {
        await Swal.fire('Error!', error, 'error')
        respuesta = undefined
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

export const cancelReserv = async (data) => {
    let respuesta = false
    try {
        let resEvent = await db.collection(`events/${data.eventInfo.code}/reservas`).where('reservaId', '==', data.reservaId).get()
        let resUser = await db.collection(`users/${data.registeredFor.dni}/reservas`).where('reservaId', '==', data.reservaId).get()
        let resEventId = resEvent.docs[0].id
        let resUserId = resUser.docs[0].id
        let resEventData = resEvent.docs[0].data()
        const event = await db.doc(`events/${data.eventInfo.code}`).get()
        let { cupos_disponibles, cupos_ocupados } = event.data()
        await db.doc(`events/${data.eventInfo.code}`).update({ cupos_disponibles: parseInt(cupos_disponibles) + parseInt(resEventData.cupos_reservados), cupos_ocupados: parseInt(cupos_ocupados) - parseInt(resEventData.cupos_reservados) })
        await db.doc(`events/${data.eventInfo.code}/reservas/${resEventId}`).delete()
        await db.doc(`users/${data.registeredFor.dni}/reservas/${resUserId}`).delete()
        respuesta = true
    } catch (err) {
        console.log(err);
    }
    return respuesta
}

export const getPersonsByEvent = async (code) => {
    try {
        const res = await db.collection(`events/${code}/reservas`).orderBy('date', "asc").get()
        let reservas = res.docs.map(el => {
            return { ...el.data(), id: el.id }
        })
        return reservas
    } catch (err) {
        console.log(err);
    }
} 
