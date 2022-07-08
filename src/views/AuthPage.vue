<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Üye ol / Giriş yap
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            Hoşgeldiniz
          </ion-card-title>
          <ion-card-subtitle>
            Üye ol / Giriş yap
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <form
              @submit.prevent="mod===AuthMode.SignIn ? signIn(email,parola) : signUp(kullaniciAdi,email,parola)">
            <ion-item v-if="mod===AuthMode.SignUp">
              <ion-label position="floating">Kullanıcı Adı</ion-label>
              <ion-input v-model="kullaniciAdi"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">E-mail</ion-label>
              <ion-input v-model="email"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Parola</ion-label>
              <ion-input v-model="parola" type="password"></ion-input>
            </ion-item>
            <ion-button expand="block" color="primary" class="ion-margin-top" type="submit">
              {{ mod === AuthMode.SignIn ? "Giriş yap" : "Üye ol" }}
            </ion-button>
            <ion-button expand="block" color="secondary" class="ion-margin-top"
                        @click="mod=mod===AuthMode.SignIn ? AuthMode.SignUp : AuthMode.SignIn">
              {{ mod === AuthMode.SignIn ? "Üye değil misiniz?" : "Hesabım var" }}
            </ion-button>
          </form>
        </ion-card-content>
        <ion-card-content v-if="hataMesaji" class="error-message">
          {{ hataMesaji }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from "vue";
import IonComps from "../shared/IonComps";
import {auth, db} from "@/main";
import {useRouter} from "vue-router";

enum AuthMode {
  SignIn,
  SignUp
}

export default defineComponent({
  components: {...IonComps},
  setup: function () {
    const router = useRouter()
    const state = reactive({
      kullaniciAdi: "",
      email: "",
      parola: "",
      mod: AuthMode.SignIn,
      hataMesaji: "",
    })

    const signIn = async (email: string, parola: string) => {
      try {
        if (!email || !parola) {
          state.hataMesaji = "Email ya da parola girilmesi zorunludur."
          return;
        }

        await auth.signInWithEmailAndPassword(email, parola).then(() => {
          router.push("/tabs/tab1")
        })

      } catch (error: any) {
        state.hataMesaji = error.message;
      }
    }

    const signUp = async (kullaniciAdi: string, email: string, parola: string) => {
      try {
        if (!email || !parola || !kullaniciAdi) {
          state.hataMesaji = "Email, parola ve kullanıcı adı girilmesi zorunludur."
          return;
        }
        await db.collection('kullanicilar')
            .where("kullaniciAdi", "==", kullaniciAdi).get().then(async (doc) => {
              if (!doc.empty) {
                state.hataMesaji = "Kullanıcı adı zaten kayıtlı"
              } else {
                const authRes: any = await auth.createUserWithEmailAndPassword(email, parola);

                authRes.user.updateProfile({
                  displayName: kullaniciAdi
                }).then(() => {
                  db.collection("kullanicilar").doc(authRes.user.uid).set({
                    kullaniciAdi,
                    email,
                  });
                  router.push("/tabs/tab1")
                })

              }
            })
      } catch (e: any) {
        state.hataMesaji = e.message
      }
    }
    return {
      ...toRefs(state),
      signIn,
      signUp,
      AuthMode
    }
  }
})
</script>


<style>


.error-message {
  color: #842029;
  background-color: #f8d7da;
  text-align: center;
}

</style>