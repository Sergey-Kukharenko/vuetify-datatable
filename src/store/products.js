export default {
    state: {
        products: [],
        product: {}
    },
    mutations: {
        setProducts(state, products) {
            state.products = products
        },
        setProduct(state, product) {
            state.product = product
        },
    },
    actions: {
        async fetchProducts({commit}) {
            try {
                commit('setLoading', true)
                const url = "https://data.jsdelivr.com/v1/stats/packages/npm/month";
                const response = await fetch(url);
                const products = await response.json();

                if (products.status === 404) {
                    commit('setError', products.message)
                } else {
                    commit('clearError')
                    commit('setProducts', products)
                    commit('setLoading', false)
                }

            } catch (e) {
                commit('setError', e)
                commit('setLoading', false)
                throw e
            }
        },
        async fetchProduct({commit}, query) {
            try {
                commit('setLoading', true)
                const url = `https://data.jsdelivr.com/v1/package/npm/${query}`;
                const response = await fetch(url);
                const product = await response.json();
                if (product.status === 404) {
                    commit('setError', product.message)
                } else {
                    commit('clearError')
                    commit('setProduct', {...product, name: query})
                }
                commit('setLoading', false)

            } catch (e) {
                commit('setError', e)
                commit('setLoading', false)
                throw e
            }
        },
    },
    getters: {
        products: s => s.products,
        product: s => s.product,
    }
}
