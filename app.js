
const express =  require('express');
const fs = require('fs');
const app = express()
app.set( 'view engine' , 'ejs' )

app.use( express.urlencoded({extended:true}))
app.use( express.json())

app.get('/' , (req ,res) =>{
    fs.readdir('./uploads' , {withFileTypes:true} , (err , files) =>{
        res.render("index" , {files} )
    })
    
})



app.post('/createfolder' , (req,res) =>{
     
     const folderName = req.body.name;
     fs.mkdir(`./uploads/${folderName}`, { recursive: true }, (err) => {
        
     });
     res.redirect('/');
    
})

app.get('/viewfolder/:name',(req , res) =>{
    fs.readdir(`./uploads/${req.params.name}` , {withFileTypes:true} , (err , files) =>{
        // console.log();
        const path = `./uploads/${req.params.name}`
        
        res.render("files" , {files,path} )
    })
    
    
})

app.get('/uploads/:folder/createfile' , (req ,res)=>{
    const folderName = req.params.folder
    res.render('createfile' , {folderName})
        
})

app.post('/uploads/:folder/savefile' , (req , res) => {
    fs.writeFile(`./uploads/${req.params.folder}/${req.body.title}` , req.body.content , (err)=>{
        if(err) throw err;
        res.redirect(`/viewfolder/${req.params.folder}`)
    })
})

app.get('/deletefolder/:name' , (req , res) =>{
    const folderPath = `./uploads/${req.params.name}`;
    fs.rmdir(folderPath, { recursive: true }, (err) => {
        if (err) {
           throw err;
        }
        res.redirect('/');
        
    });
});

app.get('/uploads/:folder/:file/viewfile' , (req , res) =>{
        fs.readFile(`./uploads/${req.params.folder}/${req.params.file}` , 'utf8' , (err , data) =>{
            const file ={
                title : req.params.file,
                content : data,
                folder : req.params.folder
            }
            console.log(file);
            
            res.render('viewfile',{file})
        })
})

app.get('/upload/:folder/:file/edit' , (req , res) =>{
    fs.readFile(`./uploads/${req.params.folder}/${req.params.file}` , 'utf8' , (err , data) =>{
        const file ={
            title : req.params.file,
            content : data,
            folder : req.params.folder
        }
       res.render('edit', {file})
    })
})
app.post('/uploads/:folder/:file/update' , (req , res) => {
    const title = req.body.title;
    const content = req.body.content
    if( title != req.params.file ){
        fs.rename(`./uploads/${req.params.folder}/${req.params.file}` , `./uploads/${req.params.folder}/${title}` , (err)=>{
            if(err) throw err;
        })
    }
    fs.writeFile(`./uploads/${req.params.folder}/${title}` , content ,(err) =>{
        if(err) throw err
        res.redirect(`/viewfolder/${req.params.folder}`)
    } )
})


app.get('/uploads/:folder/:file/deletefile' , (req , res) =>{
    fs.unlink(`./uploads/${req.params.folder}/${req.params.file}` , (err) =>{
        if(err) throw err
    } )
    res.redirect(`/viewfolder/${req.params.folder}`)
})

app.listen("3000")