export class Device{
    public static definedUseDevice(id: string){
        const isMobile = this.isMobileDevice();
        const device = document.getElementById(id);
      
        if(device != undefined){
          if(isMobile){
            device.classList.add('mobile');
          }else{
            device.classList.add('desktop');
          }
        }
      }
      
      public static isMobileDevice() { 
        if( navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
           return true;
         }
        else {
           return false;
         }
      }
}