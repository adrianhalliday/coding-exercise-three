export default defineNuxtRouteMiddleware((to, from) => {
  if (from?.name === 'feed' && to?.name === 'player') {
    to.meta.transition = { name: 'feed-to-player', mode: 'in-out' }
  } else if (from?.name === 'player') {
    to.meta.transition = { name: 'player-to-page', mode: 'out-in' }
  } else {
    to.meta.transition = { name: 'page', mode: 'out-in' }
  }
})