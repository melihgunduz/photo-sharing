<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Fotoğraflar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="yukleniyor">
      <div class="center">
        <ion-spinner color="primary">
        </ion-spinner>
      </div>
    </ion-content>
    <ion-content v-else>
      <div v-if="fotolar.length>0">
        <ion-card v-for="(foto,index) in fotolar" :key="index">
          <ion-img :src="foto"></ion-img>
        </ion-card>
      </div>
      <div v-else>Henüz fotoğraf paylaşmadınız</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import IonComp from "@/shared/IonComps";
import {reactive, toRefs} from "vue";
import {auth, db,} from '../main'

export default ({
  name: 'Tab2Page',
  components: {...IonComp},

  setup() {
    const state = reactive({
      fotolar: [] as string[],
      yukleniyor: false
    })

    const fotolarGetir = async () => {
      state.yukleniyor = true;
      const kullanici: any = auth.currentUser;
      const snap = await db.collection('kullanicilar').doc(kullanici.uid).collection('fotograflar')
          .orderBy('yuklemeZamani', "desc").get()


      if (!snap.empty) {
        snap.docs.forEach(doc => {
          const data = doc.data();

          if (data.fotograf) {
            state.fotolar.push(data.fotograf)
          }
        })
      }

      state.yukleniyor = false
    }
    fotolarGetir()

    return {...toRefs(state)}
  }
});
</script>
<style>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
</style>
