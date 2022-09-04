{
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

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author',
        optTagsListSelector = '.tags.list',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-',
        optAuthorsListSelector = '.authors.list';


    const generateTitleLinks = function (customSelector = '') {
        /* [DONE] remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* [DONE] find all the articles and save them to variable: articles */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        let html = '';

        for (let article of articles) {
            /* [DONE] get the article id */
            const articleId = article.getAttribute('id');

            /* [DONE] find the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;

            /* [???] get the title from the title element */
            /* ... */

            /* [DONE] create HTML of the link */
            const linkHTML = '<li class="class-li"><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
        const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
        return optCloudClassPrefix + classNumber;
    };

    const generateTags = function () {

        /* [NEW] create a new variable allTags with an empty object */
        let allTags = {};
        /* find all articles */
        const allArticles = document.querySelectorAll(optArticleSelector);

        /* START LOOP: for every article: */
        for (let article of allArticles) {

            /* find tags wrapper */
            const tagsWrapper = article.querySelector(optArticleTagsSelector);

            /* make html variable with empty string */

            let html = '';

            /* get tags from data-tags attribute */
            const articleTags = article.getAttribute('data-tags');

            /* split tags into array */

            const articleTagsArray = articleTags.split(' ');

            /* START LOOP: for each tag */
            for (let tag of articleTagsArray) {

                /* generate HTML of the link */
                const linkHTML = '<li class="class-li-tag"><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';

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
        const tagList = document.querySelector(optTagsListSelector);
        const tagsParams = calculateTagsParams(allTags);
        console.log('tagsParams:', tagsParams);
        /* [NEW] create variable for all links HTML code */
        let allTagsHTML = '';

        /* [NEW] START LOOP: for each tag in allTags: */
        for (let tag in allTags) {
            /* [NEW] generate code of a link and add it to allTagsHTML */
            // allTagsHTML += '<li><a href="#tag-' + tag + ' (' + allTags[tag] + ') ' + ' </a></li>';
            const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + ' ' + ' </a></li>';

            allTagsHTML += tagLinkHTML;
        }
        /* [NEW] END LOOP: for each tag in allTags: */

        /*[NEW] add HTML from allTagsHTML to tagList */
        tagList.innerHTML = allTagsHTML;

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
        const allArticles = document.querySelectorAll(optArticleSelector);

        /* START LOOP: for every articles: */
        for (let article of allArticles) {

            /* find tags wrapper */
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            /* make html variable with empty string */

            let html = '';

            /* get authors from data-author attribute */
            const articleAuthor = article.getAttribute('data-author');
            //     console.log(articleAuthor);

            /* generate HTML of the link */
            const authorLink = '<a href="#author-' + articleAuthor + '"<span>' + articleAuthor + '<span></a>';

            /* add generated code to html variable */
            html += authorLink;
            if (!allAuthors[articleAuthor]) {
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
            /* insert HTML of all the links into the tags wrapper */
            authorWrapper.innerHTML = html;

            /* END LOOP: for every article: */
        }
        const authorList = document.querySelector(optAuthorsListSelector);
        /* [NEW] create variable for all links HTML code*/
        let allAuthorsHTML = '';
        /* [NEW] START LOOP: for each author in allAuthors */
        for (let author in allAuthors) {
            /* [NEW] generate code of a link and it to allAuthorsHTML */
            allAuthorsHTML +=
                '<li><a href="#author-' +
                author +
                '"><span>' +
                author +
                ' (' +
                allAuthors[author] +
                ')</span></a></li> ';
            /* [NEW] END LOOP: for each author in allAuthors */
        }
        /* [NEW] add html from allAuthos to authorList */
        authorList.innerHTML = allAuthorsHTML;
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