('use strict');
{

    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
        articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
        authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML
        ),
    };

    const opts = {
        tagSizes: {
            count: 5,
            classPrefix: 'tag-size-',
        },
    };

    const select = {
        all: {
            articles: '.post',
            titles: '.post-title',
            linksTo: {
                tags: 'a[href^="#tag-"]',
                authors: 'a[href^="#author-"]',
            },
        },
        article: {
            tags: '.post-tags .list',
            author: '.post-author',
            title: '.post-title',
        },
        listOf: {
            titles: '.titles',
            tags: '.tags.list',
            authors: '.authors.list',
        },
    };

    const titleClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;

        /* [DONE] remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        /* [DONE] add class 'active' to the clicked link */
        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts .post');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }
        /* [DONE] get 'href' attribute from the clicked link */
        const hrefAttribute = clickedElement.getAttribute('href');

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */
        const correctArticle = document.querySelector(hrefAttribute);

        /* [DONE] add class 'active' to the correct article */
        correctArticle.classList.add('active');

    };

    const generateTitleLinks = function (customSelector = '') {
        /* [DONE] remove contents of titleList */
        const titleList = document.querySelector(select.listOf.titles);
        titleList.innerHTML = '';

        /* [DONE] find all the articles and save them to variable: articles */
        const articles = document.querySelectorAll(select.all.articles + customSelector);

        let html = '';

        for (let article of articles) {
            /* [DONE] get the article id */
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element */
            const articleTitle = article.querySelector(select.all.titles).innerHTML;

            /* [???] get the title from the title element */
            /* ... */

            /* [DONE] create HTML of the link */
            const linkHTMLData = { id: articleId, title: articleTitle };
            const linkHTML = templates.articleLink(linkHTMLData);
            /* [DONE] insert link into html variable */
            html = html + linkHTML;
        }

        titleList.innerHTML = html;
        const links = document.querySelectorAll('.titles a');
        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    };

    generateTitleLinks();

    const calculateTagsParams = function (tags) {
        const params = { max: 0, min: 999999 };
        for (let tag in tags) {
            console.log(tag + ' is used ' + tags[tag] + ' times');
            params.max = Math.max(tags[tag], params.max);
            params.min = Math.min(tags[tag], params.max);
        }
        return params;
    };

    const calculateTagClass = function (count, params) {
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
        return opts.tagSizes.classPrefix + classNumber;
    };

    const generateTags = function () {

        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};
        /* find all articles */
        const allArticles = document.querySelectorAll(select.all.articles);

        /* START LOOP: for every article: */
        for (let article of allArticles) {

            /* find tags wrapper */
            const tagsWrapper = article.querySelector(select.article.tags);

            /* make html variable with empty string */

            let html = '';

            /* get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* split tags into array */

            const articleTagsArray = articleTags.split(' ');

            /* START LOOP: for each tag */
            for (let tag of articleTagsArray) {

                /* generate HTML of the link */
                const linkHTMLData = { id: tag, tagName: tag };
                const linkHTML = templates.articleTag(linkHTMLData);

                /* add generated code to html variable */
                html += linkHTML;

                /* [NEW] check if this link is NOT already in allTags */
                if (!allTags[tag]) {
                    /* [NEW] add tag to allTags object */
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
                /* END LOOP: for each tag */
            }
            /* insert HTML of all the links into the tags wrapper */
            tagsWrapper.innerHTML = html;
            /* END LOOP: for every article: */
        }

        /* [NEW] find list of tags in right column */
        const tagList = document.querySelector(select.listOf.tags);
        const tagsParams = calculateTagsParams(allTags);

        /* [NEW] create variable for all links HTML code */
        // let allTagsHTML = '';
        const allTagsData = { tags: [] };

        /* [NEW] START LOOP: for each tag in allTags: */
        for (let tag in allTags) {
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }
        /* [NEW] END LOOP: for each tag in allTags: */

        /*[NEW] add HTML from allTagsHTML to tagList */
        console.log(allTagsData);
        tagList.innerHTML = templates.tagCloudLink(allTagsData);

    };
    generateTags();

    const tagClickHandler = function (event) {
        /* prevent default action for this event */
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;
        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');
        /* make a new constant "tag" and extract tag from the "href" constant */
        const tag = href.replace('#tag-', '');
        /* find all tag links with class active */
        const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
        /* START LOOP: for each active tag link */
        for (let activeTagLink of activeTagLinks) {
            /* remove class active */
            activeTagLink.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all tag links with "href" attribute equal to the "href" constant */
        const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

        /* START LOOP: for each found tag link */
        for (let tagLink of tagLinks) {

            /* add class active */
            tagLink.classList.add('active');

            /* END LOOP: for each found tag link */
        }

        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-tags~="' + tag + '"]');
    };

    const addClickListenersToTags = function () {
        /* find all links to tags */
        const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');
        /* START LOOP: for each link */
        for (let tagLink of allTagsLinks) {
            /* add tagClickHandler as event listener for that link */
            tagLink.addEventListener('click', tagClickHandler);
            /* END LOOP: for each link */
        }
    };

    addClickListenersToTags();

    const generateAuthors = function () {
        let allAuthors = {};
        /* find all articles */
        const allArticles = document.querySelectorAll(select.all.articles);

        /* START LOOP: for every articles: */
        for (let article of allArticles) {

            /* find tags wrapper */
            const authorWrapper = article.querySelector(select.article.author);
            /* make html variable with empty string */

            let html = '';

            /* get authors from data-author attribute */
            const articleAuthor = article.getAttribute('data-author');

            /* generate HTML of the link */
            const linkHTMLData = { id: articleAuthor, authorName: articleAuthor };
            const linkHTML = templates.articleAuthor(linkHTMLData);

            /* add generated code to html variable */
            html += linkHTML;
            if (!allAuthors[articleAuthor]) {
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
            /* insert HTML of all the links into the tags wrapper */
            authorWrapper.innerHTML = html;

            /* END LOOP: for every article: */
        }


        /* [NEW] create variable for all links HTML code */
        const allAuthorsData = { authors: [] };

        /* [NEW] START LOOP: for each tag in allTags: */
        for (let author in allAuthors) {
            allAuthorsData.authors.push({
                author: author,
                count: allAuthors[author],
            });
        }

        const authorList = document.querySelector(select.listOf.authors);
        authorList.innerHTML = templates.authorsCloudLink(allAuthorsData);
    };
    generateAuthors();

    const authorClickHandler = function (event) {
        event.preventDefault();
        /* make new constant named "clickedElement" and give it the value of "this" */
        const clickedElement = this;
        /* make a new constant "href" and read the attribute "href" of the clicked element */
        const href = clickedElement.getAttribute('href');
        /* make a new constant "tag" and extract tag from the "href" constant */
        const author = href.replace('#author-', '');
        /* find all tag links with class active */
        const activeAuthors = document.querySelectorAll(
            'a.active[href^="#author-"]'
        );
        /* START LOOP: for each active tag link */
        for (let activeAuthor of activeAuthors) {
            /* remove class active */
            activeAuthor.classList.remove('active');
            /* END LOOP: for each active tag link */
        }
        /* find all tag links with "href" attribute equal to the "href" constant */
        const authorLinks = document.querySelectorAll(
            'a[href^="#author-' + href + '"]'
        );

        /* START LOOP: for each found tag link */
        for (let authorLink of authorLinks) {
            /* add class active */
            authorLink.classList.add('active');
            /* END LOOP: for each found tag link */
        }
        /* execute function "generateTitleLinks" with article selector as argument */
        generateTitleLinks('[data-author="' + author + '"]');
    };

    const addClickListenersToAuthors = function () {
        /* find all links to authors */
        const authorsLinks = document.querySelectorAll('.post-author a');
        /* START LOOP: for each link */
        for (let authorLink of authorsLinks) {
            /* add tagClickHandler as event listener for that link */
            authorLink.addEventListener('click', authorClickHandler);
            /* END LOOP: for each link */
        }
        /* find all links to authors in right sidebar */
        const authorLinksList = document.querySelectorAll('.list.authors a');
        /* START LOOP: for each link */
        for (let authorLinkList of authorLinksList) {
            authorLinkList.addEventListener('click', authorClickHandler);
        }
    };
    addClickListenersToAuthors();
}