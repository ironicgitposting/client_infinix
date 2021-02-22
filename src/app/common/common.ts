
export class Common {
    /**
     * Créer une balise script contenant l'url du fichier js
     * @param url chemin du fichier à charger
     */
    public static loadScript(url: string) {
      const body = <HTMLDivElement>document.body;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = false;
      script.defer = true;
      body.appendChild(script);
    }
}