import axios from 'axios'

export const fetchRandomProduct = () => {
    const url = `http://localhost:3030/products_random`
    return axios({
        method: 'get',
        url,
    })
}

export const scrapeAmazon = () => {
    const url = `http://localhost:3030/scrape_amazon`
    return axios({
        method: 'get',
        url,
    })
}