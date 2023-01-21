const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const router = express.Router();

const Blog = require('../../models/blog.model');

router.get('/', async (req, res) => {
  let datas = [];

  request(
    `https://www.animalhearted.com/blogs/animal-blog`, (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);

        $('.blog--inner li').each(async (i, el) => {
          const title = $(el)
            .find('.article--excerpt-title')
            .find('a')
            .text()
            .split(' \n')
            .map(function (item) {
              return item.trim();
            })[0];
          const article = $(el).find('p').text();
          const image =
            'https:' + $(el).find('.article-list-item').find('img').attr('src');
         const link = 'https://www.animalhearted.com/' + $(el).find('a').attr('href')
          let data = {
            title,
            article,
            image,
            link
          };
          const blog = new Blog(data);
          await blog.save()
        });
      }
      res.status(200).json({msg: "scrapped"});
    }
  );
});

router.get('/allBlogs', async (req, res) => {
    const blogs = await Blog.find().lean();
    res.status(200).json(blogs);
})

router.get('/allBlogs/:id', async (req, res) => {
    const id = req.params.id;
    const blogs = await Blog.findOne({_id: id}).lean();
    res.status(200).json(blogs);
})


router.get('/blogDetail', async (req, res) => {
  let datas = [];
  const link = req.query.link;
  
  request(
    link,
    (err, response, html) => {
      if (response.statusCode === 200) {
        const $ = cheerio.load(html);
        const content = $('.article--inner .article--content').html();
        datas.push(content);

        res.status(200).json(datas);
      }
    }
  );
});

module.exports = router;
