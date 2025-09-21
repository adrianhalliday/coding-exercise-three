<template>
  <div class="loading">
    <h1>
      <span>t</span>
      <span>u</span>
      <span>b</span>
      <span>r</span>
    </h1>
    <p>Zero-effort YouTube Browser</p>
    <p>By Adrian Halliday</p>
    <div class="spinner--container">
      <div class="spinner"></div>
      <span>Connecting...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h1 {
    font-family: "Monoton", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 5rem;
    color: var(--c-white-20);
    line-height: 1;
    margin: 0;
    margin-bottom: .2em;
    
    span {
      color: var(--c-white-20);
      animation: pulse 1.2s ease infinite;

      &:nth-child(1) { animation-delay: 1s; }
      &:nth-child(2) { animation-delay: 1.1s; }
      &:nth-child(3) { animation-delay: 1.2s; }
      &:nth-child(4) { animation-delay: 1.3s; }
    }
  }

  p {
    color: var(--c-white-50);
    line-height: 1;
    margin-block-start: 0;
    margin-bottom: .3em;
    font-size: 1rem;
  }
}

@keyframes pulse {
  0% {
    color: var(--c-white-20);
  }
  50% {
    color: var(--c-white);
  }
}

// Adapted from https://css-loaders.com/spinner/

.spinner {
  &--container {
    --spinner-size: 2rem;
    position: absolute;
    left: 0;
    bottom: calc(var(--spinner-size) * 1.4);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      color: var(--c-white-20);
      font-size: .7rem;
      margin-top: 1em;
    }
  }

  width: var(--spinner-size);
  aspect-ratio: 1;
  display: grid;
  border: 2px solid #0000;
  border-radius: 50%;
  border-color: var(--c-white-20) #0000;
  animation: l16 2s infinite linear;

  &::before,
  &::after {    
    content: "";
    grid-area: 1/1;
    margin: 2px;
    border: inherit;
    border-radius: 50%;
  }
  &::before {
    border-color: var(--c-white-50) #0000;
    animation: inherit; 
    animation-duration: 1s;
    animation-direction: reverse;
  }
  &::after {
    margin: 8px;
  }
}
@keyframes l16 { 
  100%{transform: rotate(1turn)}
}
</style>
