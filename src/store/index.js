import Vue from 'vue'
import Vuex from 'vuex'
import products from './products'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        error: null,
        loading: false
    },
    mutations: {
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        },
        setLoading(state, loading) {
            state.loading = loading
        },
    },
    getters: {
        error: s => s.error,
        loading: s => s.loading,
    },
    modules: {
        products
    }
})
