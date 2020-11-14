import { db, auth } from '../firebase'
import moment from 'moment'

export const setEvent = async (data) => {
    let ref = await db.collection("events").orderBy("code", "desc").limit(1).get();
    var lastCode = parseInt(ref.docs[0].id) + 1
    let lastCodePadded = lastCode.pad(4)
    await db.collection('events').doc(lastCodePadded).set({ ...data, code: lastCodePadded, cupos_ocupados: 0 })
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

export const createInstitution = async (data) => {
    const { institutionName, email, pass, address } = data
    console.log(data);
    auth.createUserWithEmailAndPassword(email, pass)
        .then(async () => {
            await db.collection('users').doc(email).set({ institutionName, address, email, type: 'institution' })
            console.log('creado');
        })
        .catch((err) => {
            console.log(err);
        })
}

export const createUser = async (data) => {
    const { name, email, pass, tel } = data
    auth.createUserWithEmailAndPassword(email, pass)
        .then(async () => {
            await db.collection('users').doc(email).set({ name, tel, email, type: 'person' })
            console.log('creado');
        })
        .catch((err) => {
            console.log(err);
        })
}

export const authenticate = async (data) => {
    const { email, pass } = data
    let userLoged = false
    await auth.signInWithEmailAndPassword(email, pass)
        .then(async () => {
            let user = await db.collection('users').doc(email).get()
            userLoged = user.data();
        })
        .catch((err) => {
            console.log(err);
        })
    return userLoged
}

export const subscribeEventQuery = async (code, user) => {
    let ref = db.collection('events').doc(code)
    let event = await ref.get()
    let operation = false
    console.log(event);
    if (!event.exists) {
        console.log('no existe');
    } else {
        await ref.update(`subscriptors.${user.tel}`, user)
        operation = true
    }
    return operation;
}

export const subscribeInstitutionQuery = async (code, user) => {
    let institution = await db.collection('users').where('creator_id', '==', code).get()
    if (institution.docs.length > 0) {
        try {
            institution = institution.docs[0].data()
            let userFromFirebase = await db.collection('users').doc(user.email).get()
            let { institution_subscribed } = userFromFirebase.data()
            institution_subscribed.push(institution.email)
            await db.collection('users').doc(user.email).update(`institution_subscribed`, institution_subscribed)
            return true
        } catch (error) {
            console.log(error);
        }
    } else {
        return false
    }

}

export const getEventsByInstitution = (email) => {
    console.log(email);
    return (dispatch) => {
        function getData(snap) {
            return snap.docs.map(el => el.data())
        }
        db.collection('events')
            .where('creator', '==', email[0])
            .onSnapshot((snap) => {
                let data = getData(snap)
                dispatch({ type: 'GET_EVENTS', payload: data })
            })
    }
}

export const getUserByEmail = (email) => {
    return (dispatch) => {
        db.collection('users').doc(email).get()
            .then((user) => {
                console.log(user);
                dispatch({ type: 'LOGGED', payload: user.data() })
            })
    }
}