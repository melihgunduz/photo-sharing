<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Fotoğraf seçimi</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="center">
        <ion-button size="large" @click="fotoSec">
          <ion-icon :icon="camera"></ion-icon> &nbsp; Kamera
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import IonComps from "@/shared/IonComps";
import {Camera, CameraResultType} from '@capacitor/camera'
import {db, st, auth} from "@/main";
import {Geolocation} from "@capacitor/geolocation"
import {v4} from 'uuid'
import {camera} from 'ionicons/icons';
import {useRouter} from "vue-router";
import firebase from "firebase/compat/app";

export default {
  name: 'Tab1Page',
  components: {...IonComps},


  setup() {
    const router = useRouter()

    const fotoSec = async () => {
      const fotograf: any = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      })
      if (fotograf.base64String) {
        const kullanici: any = auth.currentUser;

        const guid = v4();

        const dosyaYolu = `${kullanici.uid}/resimler/${guid}.${fotograf.format}`

        const storageRef = st.ref()
        await storageRef.child(dosyaYolu).putString(fotograf.base64String, 'base64')

        const url = await storageRef.child(dosyaYolu).getDownloadURL() //yayınlanmış halinin url i

        const konum = await Geolocation.getCurrentPosition();
        const tarih = firebase.firestore.FieldValue.serverTimestamp()

        await db.collection('kullanicilar').doc(kullanici.uid).collection('fotograflar').add({
          fotograf: url,
          konum: {enlem: konum.coords.latitude, boylam: konum.coords.longitude},
          yuklemeZamani: tarih,
        }).then(() => {

          console.log('Fotoğraf başarıyla yüklendi')

          //router.push("/tabs/tab2")
          location.assign("/tabs/tab2")
        })
      }

    }
    return {camera, fotoSec}

  }

}</script>

<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
