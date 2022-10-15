let userDetails = undefined
let countScore = 0
let totalClicks = 0
window.onload = () => {
    console.log("Firebase loaded")
    document.getElementById("count-btn").onclick = () => {
        increaseCount()
    }
    document.getElementById("sign-in").onclick = () => {
        googleSignIn()
    }
    document.getElementById("sign-out").onclick = () => {
        signOut()
    }
    document.getElementById("get-board").onclick = async () => {
        console.log("hi");
        let allData = await getAllData()
        console.log(allData);

        let divData = ""
        for (let i = 0; i < allData.length; ++i) {
            divData += `<div class="block">
            <div class="name">${allData[i]["name"]}</div>
            <div class="score">${allData[i]["clicks"]}</div>
          </div>`
        }
        document.getElementById("leaderboard-data").innerHTML = divData
    }

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            userDetails = undefined
            console.log("user not signed in")
            return
        }
        userDetails = {
            "name": user["multiFactor"]["user"]["displayName"],
            "email": user["multiFactor"]["user"]["email"]
        }
        console.log(userDetails)
        document.getElementById("user-details").innerText = `Hi ${userDetails["name"]} 👋`

        // retrieve user data if it is undefined then create new doc
        let dbData = await getYourData()
        if (dbData == undefined) {
            createNewDoc()
        }
        dbData = await getYourData()
        totalClicks = dbData["clicks"] || 0
        document.getElementById("clicks").innerText = `Total clicks: ${totalClicks}`
    })
}

const increaseCount = () => {
    countScore++
    document.getElementById("count-value").innerText = countScore

    if (userDetails == undefined) return
    updateData()

    totalClicks++
    document.getElementById("clicks").innerText = `Total clicks: ${totalClicks}`
}

const googleSignIn = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log("sign in successful")
        }).catch((error) = () => {
            console.log(error);
            console.log("sign in successful")
        })
}

const signOut = () => {
    firebase.auth().signOut().then(() => {
        console.log('Sign-out successful')
    }, (error) => {
        console.log('Sign-out failed')
        console.log(error)
    })
    userDetails = undefined
}

const getYourData = async () => {
    let docPath = `/game/${userDetails["email"]}`
    let dbData = await firebase.firestore().doc(docPath).get()

    return dbData.data()
}

const createNewDoc = () => {
    firebase.firestore().collection("game").doc(userDetails["email"]).set({
        "name": userDetails["name"],
        "clicks": 0,
        "email": userDetails["email"]
    }).then(() => {
        console.log("new data added")
    });
}

const updateData = () => {
    firebase.firestore().collection("game").doc(userDetails["email"]).update({
        "clicks": firebase.firestore.FieldValue.increment(1)
    }).then(() => {
        console.log("data updated!")
    })
}

const getAllData = async () => {
    let docPath = "/game"
    snapshot = await firebase.firestore().collection(docPath).get()
    return snapshot.docs.map(doc => doc.data())
}