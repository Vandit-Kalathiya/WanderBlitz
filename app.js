const express = require('express')
const app = express()
const mongoose = require('mongoose')
// const Listing = require("./models/listing")
// const Review = require("./models/reviews")
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
// const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
// const { listingSchema, reviewSchema } = require('./schema.js')
const listings = require('./routes/listing.js')
const reviews = require('./routes/reviews.js')
const session = require('express-session')
const flash = require('connect-flash')

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash())//Make that sure you have to use flash before all routes.!

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
})

main()
    .then(() => {
        console.log("connection successful")
    })
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/", (req, res) => {
    // res.send('hi i am root')
    res.render("listings/render")
})


app.use("/listings", listings)
app.use('/listings/:id/reviews', reviews)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found.!"))
})

app.use((err, req, res, next) => {
    // res.send("something went wrong.!")
    let { statusCode = 500, message = "Something went wrong.!" } = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render("listings/errors", { message })
})

app.listen(8080, () => {
    console.log('server is listening on port 8080')
})

// app.get("/listing",(req,res)=>{
//     let list = new Listing({
//         title:"My new villa",
//         description:"by the beach",
//         price:12000,
//         location:"Calangute, Goa",
//         country:"India"
//     })
//     list.save()
//     console.log('listing saved')
//     res.send('successful')
// })
// const list = Listing.findById("657bf6e746acaa939191d8c7")
// console.log(list)