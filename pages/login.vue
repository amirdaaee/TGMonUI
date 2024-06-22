<template>
    <v-card class="mx-auto my-auto" width="400">
        <v-card-title>
            <v-icon large color="primary">mdi-login</v-icon>
            <span class="ml-2">Login</span>
        </v-card-title>
        <v-card-text>
            <v-text-field label="Username" type="text" v-model="username" required />
            <v-text-field label="Password" type="password" v-model="password" required />
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="signInWithCredentials">Login</v-btn>
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
const { signIn } = useAuth()
async function signInWithCredentials() {
    const credentials = {
        username: username.value,
        password: password.value
    }
    try {
        await signIn(credentials, { redirect: true, callbackUrl: "/media" })
    } catch (error) {
        console.error(error)
    }
}
</script>