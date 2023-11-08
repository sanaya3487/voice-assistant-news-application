import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import NewsCards from "./components/NewsCards/NewsCards";

import useStyle from './styles';
import Modal from './Modal/Modal';

import logo from './images/logo.jpg';
const alanKey='7824bad9c771c94a466fc9ba71db33ee2e956eca572e1d8b807a3e2338fdd0dc/stage';


const App = () => {
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes=useStyle();
    const [newsArticles,setNewsArticles]=useState([]);
    const [isOpen, setIsOpen] = useState(false);
     useEffect(()=>{
        alanBtn({
            key:alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                  setNewsArticles(articles);
                  setActiveArticle(-1);
                } else if (command === 'instructions') {
                  setIsOpen(true);
                } else if (command === 'highlight') {
                  setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                } else if (command === 'open') {
                  const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                  const article = articles[parsedNumber - 1];
        
                  if (parsedNumber > articles.length) {
                    alanBtn().playText('Please try that again...');
                  } else if (article) {
                    window.open(article.url, '_blank');
                    alanBtn().playText('Opening...');
                  } else {
                    alanBtn().playText('Please try that again...');
                  }
                }
              },
            });
          }, []);

    return(
        <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src="https://static.skyassets.com/contentstack/assets/bltdc2476c7b6b194dd/blt7b5ea58ad826f90e/621769c86f1e745e2c21d690/Sky-News.jpg" className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a className={classes.link} href="https://www.linkedin.com/in/samir-kumar-yadav-308531198/"> SAMIR KUMAR YADAV</a> -
            {/* <a className={classes.link} href="http://youtube.com/javascriptmastery"> JavaScript Mastery</a> */}
          </Typography>
          <img className={classes.image} src="https://i.guim.co.uk/img/media/6818b3935275972d8045e403532227f087ea7d37/0_87_4000_2400/master/4000.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=ab599ff62cd4be221b4b06ede8fcf58d" height="50px" alt="JSMastery logo" />
        </div>
      ) : null}
    </div>
    )
}
export default App;