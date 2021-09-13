const walmartAPIUtils =  require('./walmart-api-utils/utils')
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

app.get('/products_random', async (req, res) => {

    const query = await getRandomQuery()

    console.log('query', query)

    const url = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=${query}&facet=on`
    
    const headers = walmartAPIUtils.getHeaders()

    axios({
        method: 'get',
        url: url,
        headers
    }).then(result => {
        res.send(result.data.items)
    }).catch(err => {
        console.log('err', err)
        console.log('error details', err.response.data.details)
        console.log('errors', err.response.data.errors)
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
