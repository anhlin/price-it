const walmartAPIUtils = require('./walmart-api-utils/utils')
const arrayHelpers = require('./helpers/array-helpers')
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const _ = require('lodash')

const app = express()
const port = 3030

app.use(cors())

app.get('/products', (req, res) => {
    const url = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?&count=1000&soldByWmt=true&available=true'
    const headers = walmartAPIUtils.getHeaders()

    axios({
        method: 'get',
        url: url,
        headers
    }).then(result => {
        console.log('result', result)
        console.log('result items', result.data.items)
        res.send(_.uniqBy(result.data.items, 'categoryNode'))
    }).catch(err => {
        console.log('err', err)
        console.log('error details', err.response.data.details)
        console.log('errors', err.response.data.errors)
    })
})

const getRandomQuery = async () => {
    try {
        let res = await axios({
            method: 'get',
            url: 'https://random-word-form.herokuapp.com/random/noun'
        })
        return res.data
    } catch (err) {

    }
}

const getFilteredItems = (itemsArray) => {
    if (itemsArray.length) {
        const noBooks = itemsArray.filter(item => !item.categoryPath?.includes('Books') && !item.name?.includes('Paperback') && !item.name?.includes('Hardcover') && !item.name?.includes('DVD') && !item.name?.includes('CD') && !item.name?.includes('Blu-ray'))
        if (noBooks.length) {
            console.log('result with no books/cds/dvds found', noBooks.map(item => item.name))
            return noBooks
        }
    } 
}

app.get('/products_random', async (req, res, next) => {
    const headers = walmartAPIUtils.getHeaders()
    const request = async (retries) => {
        const query = await getRandomQuery()
        const url = encodeURI(`https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=${query}&facet=on`)
        console.log('try', retries, query)

        axios({
            method: 'get',
            url: url,
            headers
        }).then(result => {
            const items = result.data.items
            const filteredItems = items && getFilteredItems(items)
            if (items && filteredItems) {
                res.send(arrayHelpers.shuffleArray(filteredItems))
            } else {
                if (retries > 0) {
                    request(--retries)
                } else {
                    next()
                }
            }
        }).catch(err => {
            console.log('err', err)
            console.log('error details', err.response.data.details)
            console.log('errors', err.response.data.errors)
        })
    }
    request(5)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
