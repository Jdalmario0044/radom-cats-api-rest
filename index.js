const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
  });
api.defaults.headers.common['X-API-KEY'] = 'live_wO1QXcDv2CEJZFoB6K8P0L5TWcAVxZ2YIWnwvBXfpdQjXI3cGpJkpnrwaLHVFGbg';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3';

const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';

const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const pError = document.getElementById('error_p');

async function loadRandomCats() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random')
    console.log(data)

    if (res.status !== 200) {
        pError.innerHTML = "Info error: " + res.status;
    }else {
        const imgCat1 = document.querySelector('#catImg1');
        const imgCat2 = document.querySelector('#catImg2');
        const imgCat3 = document.querySelector('#catImg3');
        const btnSaveFavCat1 = document.querySelector('#btn_save_favCat1');
        const btnSaveFavCat2 = document.querySelector('#btn_save_favCat2');
        const btnSaveFavCat3 = document.querySelector('#btn_save_favCat3');
    
        imgCat1.src = data[0].url;
        imgCat2.src = data[1].url;
        imgCat3.src = data[2].url;

        btnSaveFavCat1.onclick = () => saveFavoriteCat(data[0].id);
        btnSaveFavCat2.onclick = () => saveFavoriteCat(data[1].id);
        btnSaveFavCat3.onclick = () => saveFavoriteCat(data[2].id);
    }

}

async function loadfavoriteCats() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            "x-api-key": 'live_wO1QXcDv2CEJZFoB6K8P0L5TWcAVxZ2YIWnwvBXfpdQjXI3cGpJkpnrwaLHVFGbg',
        },
    });

    const data = await res.json();
    console.log('Favorites')
    console.log(data)

    if (res.status !== 200) {
        pError.innerHTML = "Info error: " + res.status + data + data.message;
    }else {
        const divL1 = document.getElementById('cards_container');
        divL1.innerHTML = '';
        data.forEach(cat => {
            const sectionFavCats = document.getElementById('favoriteCats');
            const divL2 = document.createElement('div');
            const imgFavCat = document.createElement('img');
            const divL3 = document.createElement('div');
            const btnRemFavCat = document.createElement('button');
            const btnText = document.createTextNode('Remove favorite');
            // HTML structure - Estructura HTML
            imgFavCat.src = cat.image.url;
            btnRemFavCat.appendChild(btnText);
            btnRemFavCat.onclick = () => deleteFavoriteCat(cat.id);
            divL3.appendChild(btnRemFavCat);
            divL2.appendChild(imgFavCat);
            divL2.appendChild(divL3);
            divL1.appendChild(divL2);
            sectionFavCats.appendChild(divL1);

            //CSS classes - clases CSS
            divL2.classList.add('product-card');
            divL3.classList.add('product-info');
            btnRemFavCat.classList.add('btn-primary');
        });
    }
}

async function saveFavoriteCat(id) {
    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         "x-api-key": 'live_wO1QXcDv2CEJZFoB6K8P0L5TWcAVxZ2YIWnwvBXfpdQjXI3cGpJkpnrwaLHVFGbg',
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     }),
    // });
    // const data = await res.json();

    const {data, status} = await api.post('/favourites', {
        image_id: id
    });

    console.log('Saving')
    // console.log(res)

    if (status !== 200) {
        pError.innerHTML = "Info error: " + status + data.message;
    }else {
        console.log('Cat added');
        loadfavoriteCats();
    }
}

async function deleteFavoriteCat(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            "X-API-KEY": 'live_wO1QXcDv2CEJZFoB6K8P0L5TWcAVxZ2YIWnwvBXfpdQjXI3cGpJkpnrwaLHVFGbg',
        },
    });
    const data = await res.json();

    console.log('Delete')
    // console.log(res)

    if (res.status !== 200) {
        pError.innerHTML = "Info error: " + res.status + data.message;
    }else {
        console.log('Cat deleted from favorites');
        loadfavoriteCats();
    }
}

async function uploadCatImage() {
    const form = document.getElementById('uploadform');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'live_wO1QXcDv2CEJZFoB6K8P0L5TWcAVxZ2YIWnwvBXfpdQjXI3cGpJkpnrwaLHVFGbg',
        },
        body: formData,
    });
    const data = await res.json();

    if (res.status !== 201) {
        pError.innerHTML = `Info error: ${res.status} ${data.message}`;
    } else {
        console.log('Upload')
        console.log('Upload image successfuly');
        console.log({data});
        console.log(data.url);

        saveFavoriteCat(data.id)
    }
}

loadRandomCats();
loadfavoriteCats();