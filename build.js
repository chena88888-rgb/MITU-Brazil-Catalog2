// build.js
// 自动扫描SKU文件夹
// 生成 catalog.json


const fs = require("fs");
const path = require("path");


// 当前项目目录

const ROOT = __dirname;


// 输出文件

const OUTPUT = "catalog.json";


// 判断文件类型

function getType(file){


    let ext = path.extname(file)
        .toLowerCase();



    if(
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".png" ||
        ext === ".webp"
    ){

        return "image";

    }



    if(ext === ".pdf"){

        return "pdf";

    }



    if(
        ext === ".mp4" ||
        ext === ".mov" ||
        ext === ".avi"
    ){

        return "video";

    }



    if(
        ext === ".zip" ||
        ext === ".rar" ||
        ext === ".7z"
    ){

        return "archive";

    }


    return "file";


}




// 扫描SKU

function buildCatalog(){


    let catalog = {};



    let folders = fs.readdirSync(ROOT);



    folders.forEach(folder=>{


        let fullPath =
            path.join(ROOT,folder);



        // 只处理数字SKU文件夹

        if(
            fs.statSync(fullPath).isDirectory()
            &&
            /^\d+$/.test(folder)
        ){



            let files =
                fs.readdirSync(fullPath);



            catalog[folder]={

                sku:folder,

                files:[]

            };



            files.forEach(file=>{


                catalog[folder]
                .files
                .push({

                    name:file,

                    type:getType(file),

                    url:
                    `${folder}/${file}`

                });


            });



        }



    });



    fs.writeFileSync(

        OUTPUT,

        JSON.stringify(
            catalog,
            null,
            2
        ),

        "utf-8"

    );



    console.log(
        "catalog.json生成完成"
    );


}



buildCatalog();
