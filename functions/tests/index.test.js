const request = require('supertest')
const app = require('../index')
const db = require('./data/database')
const color = require('./data/colorFilter')
const colorAndKeywords = require('./data/colorAndKeywordsFilter')
const colorKeywordsAndPhotographer = require('./data/colorKeywordsAndPhotographerFilter')
const similarImage = require('./data/similarImageFilter')
const colorAndPhotographer = require('./data/colorAndPhotographerFilter')


describe('Get Endpoints', () => {
    it('Should get all images', async () => {
        const res = await request(app.app)
            .get('/api/images')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(db.testDB)
    })

    it('Should get images with white or green colors', async () => {
        const res = await request(app.app)
            .get('/api/images?colors=["white","green"]')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(color.response)
    })

    it('Should get images with white or green colors and mount or cold keywords', async () => {
        const res = await request(app.app)
            .get('/api/images?keywords=["mountains","cold"]&colors=["white","green"]')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(colorAndKeywords.response)
    })

    it('Should get images by Ali Khanafer with white or green colors and mount or cold keywords ', async () => {
        const res = await request(app.app)
            .get('/api/images?photographerName=Ali Khanafer&colors=["white","green"]')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(colorAndPhotographer.response)
    })

    it('Should get images by Ali Khanafer with white or green colors', async () => {
        const res = await request(app.app)
            .get('/api/images?keywords=["mountains","cold"]&photographerName=Ali Khanafer&colors=["white","green"]')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(colorKeywordsAndPhotographer.response)
    })

    it('Should get images similar to the image with ID RvOcFSmEVOU', async () => {
        const res = await request(app.app)
            .get('/api/images?similarImage=RvOcFSmEVOU')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(similarImage.response)
    })
})