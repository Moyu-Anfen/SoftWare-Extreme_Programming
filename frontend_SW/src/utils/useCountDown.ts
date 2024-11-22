import { ref } from 'vue';

export function useCountdown(initialTime = 30) {
  const codeDisabled = ref(false);
  const countdown = ref(initialTime);

  const startCountdown = () => {
    codeDisabled.value = true;
    countdown.value = initialTime;
    
    const interval = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(interval);
        codeDisabled.value = false;
      }
    }, 1000);
  };

  return {
    codeDisabled,
    countdown,
    startCountdown
  };
}
