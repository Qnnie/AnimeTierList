window.onload = () => {
    let url = window.location.href;
    let userProfile = '';
    let malStr = '/mal/';
    let anilistStr = '/anilist/';
    if (url.includes(malStr)) {
        let userName = url.indexOf(malStr) + 5;
        userName = url.slice(userName, url.length);
        userProfile += `https://myanimelist.net/profile/${userName}`;

    }
    if (url.includes(anilistStr)) {
        let userName = url.indexOf(anilistStr) + 9;
        userName = url.slice(userName, url.length);
        userProfile += `https://anilist.co/user/${userName}`;
    }

    document.getElementById('user-profile').href = userProfile;
    console.log(userProfile);
}
