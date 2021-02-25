import keepAlive from "./component/keep-alive.js"
import Sact from "./sact.js"

export default {
    /**
     * 
     * @param {Sact} sact 
     */
    install(sact) {
        sact.componentList.push("keep-alive");
        sact.components["keep-alive"] = keepAlive;
    }
}
