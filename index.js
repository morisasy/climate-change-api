const PORT = process.env.PORT || 8000 // this is for deploying on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()


const newspapers = [
	{ name:'thetimes',
	  address:'https://www.thetimes.com/environment/climate-crisis',
	  base: ''
	},
	{ name:'guradian',
	  address:'https://www.theguardian.com/environment/climate-crisis',
	  base: ''
	},
	{ name:'telegraph',
	  address:'https://www.thetelegraph.com/environment/climate-crisis',
	  base: 'https://www.telegraph.co.uk'
	}
]


newspapers.forEach(newspaper =>{
	axios.get(newspaper.address)
		.then(response => {
			const html = response.data
			const $=cheerio.load(html)

			$('a:contains("climate")', html).each(function(){
				const title = $(this).text()
				const url = $(this).attr('href')
				articlesList.push({
					title,
					url: newspaper.base + url,
					source: newspaper.name
				})
			})

		})

})

const articlesList = []


app.get('/', (req, res)=>{
	res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res)=>{

	res.json(articlesList)
	/*
	axios.get('https://www.theguardian.com/environment/climate-crisis')
		.then((response)=>{
			const html = response.data
			//console.log(html)
			const $=cheerio.load(html)

			$('a:contains("climate")', html).each(function(){
				const title = $(this).text()
				const url = $(this).attr('href')
				articlesList.push({
					title,
					url
				})
			})

			res.json(articlesList)
		}).catch((err)=> console.log(err))
*/
})


app.get('/news/:newspaperId', (req, res)=>{
	
	const newspaperId = req.params.newspaperId
	const newspaperAddress =newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
	console.log(newspaperAddress)

	const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base 

	axios.get(newspaperAddress)
		.then(response => {
			const html = response.data
			const $= cheerio.load(html)
			const specificArticle =[]

			$('a:contains("climate")', html).each(function(){
				const title = $(this).text()
				const url = $(this).attr('href')
				specificArticle.push({
					title,
					url: newspaperBase + url ,
					source: newspaperId
				})
			})
			res.json(specificArticle)

		}).catch((err)=> console.log(err))
})


app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))
