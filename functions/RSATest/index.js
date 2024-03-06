async function lambda(input, callback) {
  const { Toolbelt } = require("lp-faas-toolbelt");
  const secretClient = Toolbelt.SecretClient();
  const crypto = require("crypto");
  const fs = require("fs");

  const encryptedData = fs.readFileSync("encrypted_data.txt", {
    encoding: "utf-8",
  });
  // const privateKey = fs.readFileSync("private.pem", { encoding: "utf-8" });

  const pkey =
    "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAxY+KtV1ZV85iJpzxJZLDZWvMeIIYvqYA3tqHy204G08TIaBe\nI/QGnDaeJnR5nVSBEpSSiafk3VLOxixj8uwTW7wwRts40V3nmZMvotfqK0PXTTzg\nVFZ1nDlm1TA6gbi9W1rBWjgs5IDPsD5VilETo7DJFRx+nN3JRwloZtKrJETXjbPV\nGfQVy4aR/OSh1CrtvCOP/URy6hQmtaxV/wjWnx8QC658FWcc7EHsbATJaoX3pXF/\ntT8VhVTAu53ymEeZnORHRogu+KFVJFNS1ShJtBKwVWiLVRqL6xDRHxbceZEGJHiF\nvWhn3XP+kqpmosheBU2iJw3IMWqNSup1TvmHcwIDAQABAoIBAFQ4Bued7dJStuDD\nEsHzuLxpofbVbvsHBWP7QNxlqP9rTDqPhNJK2u6JEg5OpPF+7q8fCwEHw7bd8Cvn\nDIyoOvBmXyY1mhkWsP51El+XL8pV11ij1PXfDbAVgFLthmN6f66MF9UAEZMvnloB\nmLGoMnkbif0n8omoun8/8XOz5yVEO85MhxrkMAl7/U9fjEB0mCpVHt+I7YP5ZGo9\nypfKLchAFyjaIzZn8mRn58gx16suEkmhvIaeQDVdIHEhImj/Jd9lqXUM/adL1kTv\nfnTlL3B6Bew3EYgC2RFPn7R15J2LgbCKq2sXwA9IVgwnk2EYzPOhet4g6l7DJmL3\nA66xZhECgYEA6JFHJZF5U5ZYVaiE3xOmKtCOS7nOlU+TV6XEAmnQhZDxyEy9ZhmZ\n4Ktm6UaPqkDFnRvVaVpL5ILjaCsDzHuBG6Do6th7jHkvxuy6Nt973QQWymGRqibD\nU0xp37siu/8oN7z3ZWnP/H0Vc46nSoC57EdNXey3LaYMOUE+zH1jcM8CgYEA2XdR\nT8iXZOSsRtFswe1kViUru5ksn8faOCFQzAujLmDLAHKslONhZWk1EOPfAyaxekNY\nszmgKm8WTX5Q/pmGyC62nH34hjxt0in721sc49Rr7Fif+fLCKd2YuxIOneiRUHvh\nRDF6vRV8BJHJrfevM72J9zlxOitchZKcL6XeQB0CgYEAsFxK2aBhoxNl1T8/03Kx\nFdKltaMnl26Ky3J3G2VmrYLm9v/KuLw9RnR0S/4oP/FyaduLkKLa3mSrUnkcHlqh\n43O4bS7RMgtMQcuOwsHiyg2pwrsOnTtb77UIrJLamjm6I9p2uT7ubAfm1oSdNBA9\n7YF8l/dESaebqWdi2etUF10CgYAg1XIScL/i/N/CBYa9NQGMPCqBNZxWN4+MIAOZ\n+zvVGcostCO4iyg+bocTmMQoLqRnSFnRHadAIOumIadK+ZUvDlaGBEMMyXzvWWVs\ndjJDd+QfmDX3QB7uwUV5IT3Ru7aNB1c4u5vDhsXlzrk7qgTq8/gruqGM3dUnWb55\nNzr6RQKBgQDlSQ1mJHgN+/ath9/goK2UV+kfzsKe5x4mO5+cvRW8nGj9UnjBNapo\nVyXlPxnLecB/adMyX5OwmP+7NHlaOxIPnrfxGpmmrrFOSPKrDWgjmyQoeXj7oeRT\nFvgeamZ9aXIhYfd2hByZHanrG8mgkrYHWgSmxrp6ZGCHYQoIxosvzA==\n-----END RSA PRIVATE KEY-----";
  var encoded = Buffer.from(pkey, "utf-8").toString();

  //   let pk = pkey.split("\n");

  // let s = pk.forEach((e) => {
  //   s = e + "\n";
  // });
  // console.info(s);

  // var stream = fs.createWriteStream("my_file.txt");
  // stream.once("open", function (fd) {
  //   pk.forEach((e) => {
  //     stream.write(e + "\n");
  //   });
  //   stream.end();
  // });
  // const privateKey = s;

  // const privateKey = fs.readFileSync("my_file.pem", { encoding: "utf-8" });
  //console.info("test123");
  // console.info("encoded = " + encoded);

  let secretValue = await secretClient.readSecret("private_key");
  console.info("secrete is " + secretValue.value);
  const privateKey = Buffer.from(secretValue.value, "utf-8").toString();

  const encryptedDataString =
    "atIdX6lmoTt9mso6IRUl/3PC0O2+/IkF00oE5uV03m6zN5jdqXYdxlNBIk8tEc7i9pLsDz24atWEg27pdw1he/iRxqwiiU44BkuXOGbXdccCTaRihgde6YiOA5lJVgL7Qh9OGiFD4Eghe74OCn8q+Tml2B5DXCJk/f9Un+uqntWaU0hUIm26YCNpSo6THjlQesYV6VXtQtJmkL1viCAk1JELjqSa7SzYNMr4JSgWcmNk+8DwVtSX5kFzAV3xooV895nqAPqEyOgVm7Nc+mGGJ8GXxQ4a5CjVriTCZsMeAsK3kPne8X7zTb4JS1woyPPWJ/GOkRnKN6IE8gETB/LEiQ==";

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // Buffer.from(encryptedData, "base64")
    Buffer.from(encryptedDataString, "base64")
  );

  fs.writeFileSync("decrypted_data.txt", decryptedData.toString("utf-8"), {
    encoding: "utf-8",
  });

  const result = JSON.parse(decryptedData.toString("utf-8"));

  // callback(null, `Hello World`);
  callback(null, result);
}
