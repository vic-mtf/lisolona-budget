const checkMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileUA = /android|iphone|ipad|ipod|blackberry|windows phone/i.test(
    userAgent
  );
  return isMobileUA;
};

export default checkMobile;
