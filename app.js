/**
 * Fucking sick-ass algorithm to wreck anyone who dares to stand against us in the game of...
 *                                                                                                                              
 *                                                                                          dddddddd                            
 * WWWWWWWW                           WWWWWWWW                                              d::::::dlllllll                     
 * W::::::W                           W::::::W                                              d::::::dl:::::l                     
 * W::::::W                           W::::::W                                              d::::::dl:::::l                     
 * W::::::W                           W::::::W                                              d:::::d l:::::l                     
 *  W:::::W           WWWWW           W:::::W ooooooooooo   rrrrr   rrrrrrrrr       ddddddddd:::::d  l::::l     eeeeeeeeeeee    
 *   W:::::W         W:::::W         W:::::Woo:::::::::::oo r::::rrr:::::::::r    dd::::::::::::::d  l::::l   ee::::::::::::ee  
 *    W:::::W       W:::::::W       W:::::Wo:::::::::::::::or:::::::::::::::::r  d::::::::::::::::d  l::::l  e::::::eeeee:::::ee
 *     W:::::W     W:::::::::W     W:::::W o:::::ooooo:::::orr::::::rrrrr::::::rd:::::::ddddd:::::d  l::::l e::::::e     e:::::e
 *      W:::::W   W:::::W:::::W   W:::::W  o::::o     o::::o r:::::r     r:::::rd::::::d    d:::::d  l::::l e:::::::eeeee::::::e
 *       W:::::W W:::::W W:::::W W:::::W   o::::o     o::::o r:::::r     rrrrrrrd:::::d     d:::::d  l::::l e:::::::::::::::::e 
 *        W:::::W:::::W   W:::::W:::::W    o::::o     o::::o r:::::r            d:::::d     d:::::d  l::::l e::::::eeeeeeeeeee  
 *         W:::::::::W     W:::::::::W     o::::o     o::::o r:::::r            d:::::d     d:::::d  l::::l e:::::::e           
 *          W:::::::W       W:::::::W      o:::::ooooo:::::o r:::::r            d::::::ddddd::::::ddl::::::le::::::::e          
 *           W:::::W         W:::::W       o:::::::::::::::o r:::::r             d:::::::::::::::::dl::::::l e::::::::eeeeeeee  
 *            W:::W           W:::W         oo:::::::::::oo  r:::::r              d:::::::::ddd::::dl::::::l  ee:::::::::::::e  
 *             WWW             WWW            ooooooooooo    rrrrrrr               ddddddddd   dddddllllllll    eeeeeeeeeeeeee  
 *                                                                                                                              
 * 
 * 
 * @author Dmitry Gerasin <dmitry.gerasin@mail.mcgill.ca>
 */



const {
   PORT,
   HOSTNAME,
}                       = require(`./config/config.json`)

const express           = require(`express`)
   const app            = express()
const http              = require(`http`)
const router            = require(`./routes`)


// 1. Bodyparser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// 2. Router
app.use(router)

// 3. Start server (only listens to 127.0.0.1 (nginx) to prevent direct access via port 8080)
http.createServer(app).listen(PORT, HOSTNAME, () => { 
   console.log(`HTTP Server running on port ${PORT}`)
})