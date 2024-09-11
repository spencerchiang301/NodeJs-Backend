This repository use NodeJS to develop a backend server.
It suppor these functions:

1. db/mysql module: handle all operation for mysql or mariadb server
2. db/mongo module: handle all operation for mongo server
3. messaging module: handel all operation for rabbitmq server
4. HandelFile module:  Upload file with multi extension like jpg, pdf, csv ..
5. HandleAuth module:  Using for login, register a new user, reset password.
6. HaneleMaile module: Send the email to recipient based on the google gmail service.

How to use: 
1. using docker to implement mysql, mongodb, rabbitmq container
2. clone this repository to you localhost and execute "node main.js"
3. using browser or postman to test the url in the routing table under the utility/router.js



此儲存庫使用 NodeJS 開發後端伺服器。
它支援這些功能：

1. db/mysql模組：處理mysql或mariadb伺服器的所有操作
2. db/mongo模組：處理mongo伺服器的所有操作
3. 訊息模組：處理rabbitmq伺服器的所有操作
4. HandelFile模組：上傳具有多種副檔名的文件，如jpg、pdf、csv ..
5. HandleAuth模組：用於登入、註冊新使用者、重設密碼。
6. HaneleMaile模組：基於google gmail服務將電子郵件傳送給收件者。

使用方法：
1. 使用docker實作mysql、mongodb、rabbitmq容器
2. 將此儲存庫克隆到本機並執行“node main.js”
3. 使用瀏覽器或postman測試utility/router.js下路由表中的url
