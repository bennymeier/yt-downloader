var convertBtn = document.querySelector('.convert-button');
var URLinput = document.querySelector('.URL-input');
convertBtn.addEventListener('click', () => {
    sendURL(URLinput.value);
});
function sendURL(URL) {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
}
let url = "http://localhost:4000/test";
fetch(url).then(response => response.json())
    .then((result) => {
        console.log('success:', result)
        let div = document.getElementById('test');
        div.innerHTML = `title: ${result.title}<br/>message: ${result.message}`;
    })
    .catch(error => console.log('error:', error));