const mongoose=require('mongoose');
let Schema=mongoose.Schema;
var contentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]
});
let Comment; // to be defined on new connection (see initialize)

//initialize
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://kbnguy:Howareyou14@ds115035.mlab.com:15035/web322_as6");
        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           Comment = db.model("comments", contentSchema);
           resolve();
        });
    });
};

//addComment(data)
module.exports.addComment = (data)=> {
    return new Promise( (resolve, reject)=> {
        data.postedDate = Date.now();

        let newComment = new Comment(data);

        newComment.save((err) => {
            if (err) 
                reject("There was an error saving the comment: "+ err); 
            else 
                resolve(newComment._id);
            
        });
    });
};

//getAllComments()
module.exports.getAllComments = ()=> {
    return new Promise((resolve, reject)=> {
        Comment.find().sort({ 'postedDate': 1 })
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

//addReply(data)
module.exports.addReply = (data) =>{
    return new Promise( (resolve, reject)=> {
        data.repliedDate = Date.now();
        Comment.update({ _id: data.comment_id }, 
            { $addToSet: { replies: data }},
            { multi: false } )
            .exec()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });

};