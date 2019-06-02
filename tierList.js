const username = process.argv[2];
const after = 0;
const type = 'anime'; // can be either `anime` or `manga`

let animeList = [];
let S_Tier = [];
let A_Tier = [];
let B_Tier = [];
let C_Tier = [];
let D_Tier = [];
let F_Tier = [];
let Unranked = [];

const emptyTiers = () => {
    while (animeList.length != 0) {
        animeList.pop();
    }
    while (S_Tier.length != 0) {
        S_Tier.pop();
    }
    while (A_Tier.length != 0) {
        A_Tier.pop();
    }
    while (B_Tier.length != 0) {
        B_Tier.pop();
    }
    while (C_Tier.length != 0) {
        C_Tier.pop();
    }
    while (D_Tier.length != 0) {
        D_Tier.pop();
    }
    while (F_Tier.length != 0) {
        F_Tier.pop();
    }
    while (Unranked.length != 0) {
        Unranked.pop();
    }
}

const createTierList = () => {
    animeList.forEach((show) => {
        switch(show.score) {
            case 10:
                S_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 9: 
                A_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 8: 
                B_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 7: 
                C_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 6: 
                D_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
                F_Tier.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
            case 0: 
                Unranked.push({
                    title: show.title,
                    image: show.image,
                    url: show.url
                });
                break;
        }
    });
}

const printTierList = () => {
    console.log(`S:`);
    for (let i = 0; i<S_Tier.length; i++) {
        console.log(S_Tier[i].title);
    }
    console.log(`A:`);
    for (let i = 0; i<A_Tier.length; i++) {
        console.log(A_Tier[i].title);
    }
    console.log(`B:`);
    for (let i = 0; i<B_Tier.length; i++) {
        console.log(B_Tier[i].title);
    }
    console.log(`C:`);
    for (let i = 0; i<C_Tier.length; i++) {
        console.log(C_Tier[i].title);
    }
    console.log(`D:`);
    for (let i = 0; i<D_Tier.length; i++) {
        console.log(D_Tier[i].title);
    }
    console.log(`F:`);
    for (let i = 0; i<F_Tier.length; i++) {
        console.log(F_Tier[i].title);
    }
    console.log(`Unranked:`);
    for (let i = 0; i<Unranked.length; i++) {
        console.log(Unranked[i].title);
    }
}

module.exports = {
    username,
    after,
    type,
    animeList,
    S_Tier,
    A_Tier,
    B_Tier,
    C_Tier,
    D_Tier,
    F_Tier,
    Unranked,
    createTierList,
    printTierList,
    emptyTiers
}