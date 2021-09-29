import { db, auth } from '../firebase'
import moment from 'moment'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router'

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
            dt_id: moment(data.date).format('YYYYMMDD'),
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
        db.collection('events')
        .where('creator_email', '==', email)
        .orderBy("dt_id", "desc")
        .get().then((events) => {
                let dataEvents = []
                events.forEach((ev) => {
                    const data = ev.data()
                    dataEvents.push(data)
                })
                dispatch({ type: 'GET_EVENTS', payload: dataEvents })
            }).catch((error) => console.error(error))
    }
}

export const createInstitution = async (data) => {
    const { institutionName, email, pass, address, repeatPass, creator_id } = data
    const idCreated = await db.collection('users').where('creator_id', '==', creator_id.toUpperCase()).get()
    if(!creator_id || idCreated.docs.length > 0){
        Swal.fire('Error', 'El codigo de identificación elegido ya existe', 'error')
        return null
    } 
    if (pass !== repeatPass) {
        await Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
        return null
    } else {        
        auth.createUserWithEmailAndPassword(email, pass)
            .then(async () => {
                await db.collection('users').doc(email).set({ institutionName, address, email, type: 'institution', creator_id: creator_id.toUpperCase() })
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
                await db.collection('users').doc(dni).set({ name, dni, tel, email, type: 'person',institution_subscribed: ['comunidadcristianadontorcuato@gmail.com']})
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
        if (institution.empty) throw `No hay ninguna institución asocialda a este código`
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
            .where('creator_email', '==', email[0])
            .where('dt_id', '>=', moment().format('YYYYMMDD'))
            .orderBy("dt_id", "asc")
            .get()
            .then((snap) => {
                let data = getData(snap)
                dispatch({ type: 'GET_EVENTS', payload: data })
            })
            .catch((err) => console.log(err))
    }
}

export const getUserByDNI = (dni) => {
    Swal.fire({ title: 'Cargando...' })
    Swal.showLoading()
    return (dispatch) => {
        db.collection('users').doc(dni).get()
            .then((user) => {
                dispatch({ type: 'LOGGED', payload: user.data() })
                Swal.close()
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
        const res = await db.doc(`events/${data.eventInfo.code}`).get()
        let { cupos_disponibles, cupos_ocupados } = res.data()
        if (typeof cupos_disponibles === 'string') cupos_disponibles = parseInt(cupos_disponibles)
        if (typeof cupos_ocupados === 'string') cupos_ocupados = parseInt(cupos_ocupados)
        if((cupos_disponibles !== 0 && !cupos_disponibles) || (cupos_ocupados !== 0 && !cupos_ocupados)) throw 'Por favor intente nuevamente'
        await db.collection(`events/${data.eventInfo.code}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY'), reservaId: reservaId })
        await db.collection(`users/${data.registeredFor.dni}/reservas`).doc().set({ ...data, time: moment().format('HH:mm'), date: moment().format('DD-MM-YYYY'), reservaId: reservaId })
        if (data.type === 'family') {
            let dataToUpdate = { cupos_disponibles: cupos_disponibles - data.integrants.length, cupos_ocupados: cupos_ocupados + data.integrants.length }
            if(!dataToUpdate.cupos_disponibles || !dataToUpdate.cupos_ocupados) throw 'Por favor intente nuevamente'
            await db.doc(`events/${data.eventInfo.code}`).update(dataToUpdate)
        } else {
            let dataToUpdate = { cupos_disponibles: cupos_disponibles - 1, cupos_ocupados: cupos_ocupados + 1 }
            if(!dataToUpdate.cupos_disponibles || !dataToUpdate.cupos_ocupados) throw 'Por favor intente nuevamente'
            await db.doc(`events/${data.eventInfo.code}`).update(dataToUpdate)
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
        const res = 
            await db
                .collection(`users/${dni}/reservas`)
                .orderBy('reservaId', 'desc')
                .get()
        let reservas = res.docs.map(el => {
            return { ...el.data(), id: el.id }
        })
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
        let dataToUpdate = { cupos_disponibles: parseInt(cupos_disponibles) + parseInt(resEventData.cupos_reservados), cupos_ocupados: parseInt(cupos_ocupados) - parseInt(resEventData.cupos_reservados) }
        if(
            (dataToUpdate.cupos_disponibles !== 0 && !dataToUpdate.cupos_disponibles) || 
            (dataToUpdate.cupos_ocupados !== 0 && !dataToUpdate.cupos_ocupados)
            ) throw 'Por favor intente nuevamente'
        await db.doc(`events/${data.eventInfo.code}`).update(dataToUpdate)
        await db.doc(`events/${data.eventInfo.code}/reservas/${resEventId}`).delete()
        await db.doc(`users/${data.registeredFor.dni}/reservas/${resUserId}`).delete()
        respuesta = true
    } catch (err) {
        await Swal.fire('Error!', err, 'error')
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

export const checkForm = async (institution, dni) => {
    try {
        const institutionData = (await db.doc(`users/${institution}`).get()).data()
        if(!institutionData.hasForm) return;
        
        const forms = await db.collection(`users/${institution}/forms`)
        .where('integrants_dni', 'array-contains', dni).get()

        if(forms.empty){
            return Swal.fire({
                title: 'Espera!', 
                text: `${institutionData.institutionName} necesita que complete un formulario de membresia. ¿Desea completarlo?`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Completar',
                cancelButtonText: 'Más tarde',
                reverseButtons: true
            })          
        } else {
            await db.doc(`users/${dni}`).update({institutionForm: {completed: true, date: moment().format('YYYY-MM-DD')}})
            return false
        }
    } catch (err) {
        Swal.fire('ocurrio un error')
    }
}

export const getMemberFormdata = async (dni, institutionId) => {
        return (await db.doc(`users/${institutionId}/membersForms/${dni}`).get()).data()
}

export const saveSecondStepMemberForm = async (dni, institutionId, formData) => {
    try {
        const path = `users/${institutionId}/membersForms/${dni}`
        if((await db.doc(path).get()).exists){
            await db.doc(path).update({personalData: formData})
        } else {
            await db.doc(path).set({personalData: formData})
        }
    } catch (err) {
        Swal.fire('Ocurrio un error al guardar los datos')
    }
}

export const saveThirdStep = async (dni, institutionId, {integrantsData, integrantsDni}) => {
    try {
        await db.doc(`users/${institutionId}/membersForms/${dni}`).update({integrantsData, integrantsDni})
    } catch (err) {
        Swal.fire('Ocurrio un error al guardar los datos')
    }
}

export const saveFourthStep = async (dni, institutionId, {convertionData, baptismData, signature}) => {
    try {
        await db.doc(`users/${institutionId}/membersForms/${dni}`).update({convertionData, baptismData, signature})
        await db.doc(`users/${dni}`).update({memberFormCompleted: true})
    } catch (err) {
        Swal.fire('Ocurrio un error al guardar los datos')
    }
}

// const addidDt = async () => {
//     try {
//         let events = await db.collection('events').get()
//         console.log(events);
//         for (let i = 0; i < events.docs.length; i++) {
//             const ev = events.docs[i];
//             let data = ev.data();
//             console.log(data);
//             let id = ev.id;
//             if (data.date) {
//                 let dtArr = data.date.split('-');
//                 console.log(`${dtArr[2]}${dtArr[1]}${dtArr[0]}`);
//                 await db.doc(`events/${id}`).update('dt_id', `${dtArr[2]}${dtArr[1]}${dtArr[0]}`)
//             }
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }

// addidDt()