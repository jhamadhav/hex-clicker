let num = 0
let userDetails = undefined
let countScore = 0
let totalClicks = 0
window.onload = () => {

    document.getElementById("leaderboard-btn").onclick = () => {
        let leaderboard = document.getElementsByClassName("leaderboard")[0]
        leaderboard.style.display = (leaderboard.style.display == "") ? "flex" : ""
        if (leaderboard.style.display == "") return
        generateLeaderboard()
    }

    document.getElementById("sign-in").onclick = () => {
        googleSignIn()
    }
    document.getElementById("sign-out").onclick = () => {
        signOut()
    }
    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            userDetails = undefined
            console.log("user not signed in")
            document.getElementById("user-name").innerText = "Friend"

            //show sign-in
            document.getElementById("sign-in").style.display = "flex"
            document.getElementById("sign-out").style.display = "none"
            return
        }
        resetData()

        // show sign-out
        document.getElementById("sign-in").style.display = "none"
        document.getElementById("sign-out").style.display = "flex"

        userDetails = {
            "name": user["multiFactor"]["user"]["displayName"],
            "email": user["multiFactor"]["user"]["email"]
        }
        console.log(userDetails)
        document.getElementById("user-name").innerText = userDetails["name"]

        // retrieve user data if it is undefined then create new doc
        let dbData = await getYourData()
        if (dbData == undefined) {
            createNewDoc()
        }
        dbData = await getYourData()
        totalClicks = dbData["clicks"] || 0
        document.getElementById("totalclicks").innerText = totalClicks
        generateLeaderboard()
    })


    document.getElementsByClassName("btn-holder")[0].onclick = () => {
        increaseCount()
    }
}

const createPlusOneAnimation = () => {
    let div = document.createElement("div");

    //fill text and location
    let hexBtn = btn.getBoundingClientRect();
    let x =
        hexBtn.left +
        hexBtn.width / 2 +
        Math.pow(-1, num % 2) * ((Math.random() * hexBtn.width) / 2);
    let y = hexBtn.top - Math.random() * 30;

    div.innerText = "+1";
    div.style.top = y + "px";
    div.style.left = x + "px";

    div.classList.add("anim");
    document.body.appendChild(div);

    //add event listener that will delete the div once the animation ends
    div.addEventListener("animationend", () => {
        div.parentNode.removeChild(div);
    });
}

const increaseCount = () => {
    countScore++
    document.getElementById("point").innerText = countScore;
    createPlusOneAnimation()

    if (userDetails != undefined) {
        updateData()
    }

    totalClicks++
    document.getElementById("totalclicks").innerText = totalClicks
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
    resetData()
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
const generateLeaderboard = async () => {
    if (!userDetails) return

    let data = await getAllData()

    let divData = ""
    for (let i = 0; i < data.length; ++i) {
        if (data[i]["name"] == userDetails["name"]) continue
        divData += `
        <div class="block">
        <div class="user-name">${data[i]["name"]}</div>
        <div class="clicks">${data[i]["clicks"]}</div>
      </div>`
    }
    document.getElementsByClassName("leaderboard-data")[0].innerHTML = divData
}

const resetData = () => {
    userDetails = undefined
    totalClicks = 0
    countScore = 0
    document.getElementById("point").innerText = countScore;
    document.getElementById("totalclicks").innerText = totalClicks
    document.getElementsByClassName("leaderboard-data")[0].innerHTML = ""
}