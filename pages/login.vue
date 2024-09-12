<template>
    <v-card class="mx-auto my-auto" width="400">
        <v-card-title>
            <v-icon large color="primary">mdi-login</v-icon>
            <span class="ml-2">Login</span>
        </v-card-title>
        <v-card-text>
            <v-text-field label="Username" type="text" v-model="username" required />
            <v-text-field label="Password" type="password" v-model="password" required />
            <p class="text-red">{{ errText }}</p>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="signInWithCredentials" :disabled="loadingState">Login</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup lang="ts">
definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/media',
    }
})
const username = ref('')
const password = ref('')
const errText = ref<string | null>(null)
const loadingState = ref(false)
const { signIn } = useAuth()
// ...
async function signInWithCredentials() {
    const credentials = {
        username: username.value,
        password: password.value
    }
    try {
        loadingState.value = true
        await signIn(credentials, { redirect: true, callbackUrl: "/media" })

    } catch (error) {
        console.error(error)
        errText.value = "an error happened"
        loadingState.value = false
    }
}
</script>