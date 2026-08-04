// build.js
//
// 自动扫描SKU文件夹
// 自动生成 catalog.json
//


const fs = require("fs");

const path = require("path");

const PRODUCTS = require("./products.json");


// 当前仓库目录

const ROOT = __dirname;


// 输出文件

const OUTPUT = "catalog.json";



// ===============================
// 时间格式化
// ===============================

function formatTime(time){

    const date = new Date(time);


    return date.toLocaleString(
        "zh-CN",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}



// ===============================
// 获取更新时间
// ===============================

function getUpdateTime(filePath){

    const stat = fs.statSync(filePath);

    return formatTime(stat.mtime);

}



// ===============================
// 判断7天内更新
// ===============================

function isRecent(filePath){

    const stat = fs.statSync(filePath);


    const now = Date.now();


    const diff =
    now - stat.mtimeMs;


    const sevenDays =
    7 * 24 * 60 * 60 * 1000;


    return diff <= sevenDays;

}





// ===============================
// 判断文件类型
// ===============================

function getType(file){


    const ext =
    path.extname(file)
    .toLowerCase();



    if(
        [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif"
        ]
        .includes(ext)
    ){

        return "image";

    }



    if(

        ext === ".html"

        &&

        file.toLowerCase()
        ===
        "product-spec.html"

    ){

        return "spec";

    }



    if(ext === ".pdf"){

        return "pdf";

    }



    if(
        [
            ".mp4",
            ".mov",
            ".webm",
            ".avi"
        ]
        .includes(ext)
    ){

        return "video";

    }



    if(
        [
            ".zip",
            ".rar",
            ".7z"
        ]
        .includes(ext)
    ){

        return "archive";

    }



    return "file";

}





// ===============================
// 生成catalog
// ===============================


function buildCatalog(){


    const catalog = {};



    const folders =
    fs.readdirSync(ROOT);



    folders.forEach(folder=>{


        const folderPath =
        path.join(ROOT,folder);



        if(

            fs.statSync(folderPath)
            .isDirectory()

            &&

            /^\d+$/.test(folder)

        ){



            console.log("发现SKU:", folder);



            const files =
            fs.readdirSync(folderPath);





            catalog[folder]={


                sku:folder,


                name:
                PRODUCTS[folder]?.name || "",


                category:
                PRODUCTS[folder]?.category || "",


                keywords:
                PRODUCTS[folder]?.keywords || [],



                updatedAt:
                getUpdateTime(folderPath),



                recent:
                isRecent(folderPath),



                files:[]

            };






            files.forEach(file=>{


                const filePath =
                path.join(folderPath,file);



                catalog[folder]
                .files
                .push({


                    name:file,


                    type:getType(file),


                   url:
                   folder + "/" + file,



                    updatedAt:

                    getUpdateTime(filePath),



                    recent:

                    isRecent(filePath)


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
```
