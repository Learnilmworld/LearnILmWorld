import { useEffect } from 'react';

declare global {
  interface Window {
    fbAsyncInit: any;
    FB: any;
  }
}

export const useFacebook = () => {
  const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const FACEBOOK_VERSION = import.meta.env.VITE_FACEBOOK_API_VERSION ;

  useEffect(() => {
    if (!FACEBOOK_APP_ID) {
      console.warn("Facebook App ID not found in .env");
      return;
    }
    if (window.FB) return;

    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : FACEBOOK_APP_ID,
        cookie     : true, 
        xfbml      : true, 
        version    : FACEBOOK_VERSION
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0] as HTMLElement;
       if (d.getElementById(id)) {return;}
       js = d.createElement(s) as HTMLScriptElement; 
       js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       if(fjs && fjs.parentNode) {
         fjs.parentNode.insertBefore(js, fjs);
       }
     }(document, 'script', 'facebook-jssdk'));
  }, [FACEBOOK_APP_ID, FACEBOOK_VERSION]);

  const loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject("Facebook SDK not loaded, try again later.");
        return;
      }
      
      window.FB.login((response: any) => {
        if (response.authResponse) {
          resolve({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          });
        } else {
          reject('User cancel the request.');
        }
      }, { scope: 'public_profile,email' }); 
    });
  };

  return { loginWithFacebook };
};