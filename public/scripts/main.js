let num = 0;

window.onload = () => {
    let hexBtnHolder = document.getElementsByClassName("btn-holder");
    document.getElementById("leaderboard-btn").onclick = () => {
        let leaderboard = document.getElementsByClassName("leaderboard")[0]
        leaderboard.style.display = (leaderboard.style.display == "none") ? "flex" : "none"
    }
    hexBtnHolder[0].onclick = () => {
        num++;
        increasePoint(num);
    }
}

const increasePoint = (num = 0) => {
    document.getElementById("point").innerText = num;
    createPlusOneAnimation();
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