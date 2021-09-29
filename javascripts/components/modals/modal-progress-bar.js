"use strict";

Vue.component("modal-progress-bar", {
  components: {
    "offline-speedup-button": {
      props: {
        button: Object,
        progress: Object,
      },
      computed: {
        canBeClicked() {
          return this.button.condition(this.progress.current, this.progress.max);
        },
        buttonClass() {
          return {
            "o-primary-btn--width-medium": true,
            "o-primary-btn--disabled": !this.canBeClicked,
          };
        }
      },
      methods: {
        buttonClicked() {
          if (!this.canBeClicked) return;
          this.button.click();
        }
      },
      template: `
        <primary-button
          :class="buttonClass"
          :key="button.text"
          @click="buttonClicked"
        >
          {{ button.text }}
        </primary-button>`
    },
  },
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remaining() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      return formatFloat(
        TimeSpan.fromMilliseconds(timeSinceStart / (this.progress.current / this.progress.max)).totalSeconds -
        TimeSpan.fromMilliseconds(timeSinceStart).totalSeconds
        , 1);
    },
    buttons() {
      return this.progress.buttons || [];
    }
  },
  template: `
    <div class="l-modal-overlay c-modal-overlay" style="z-index: 8">
      <div class="l-modal-progress-bar c-modal">
        <div class="c-modal-progress-bar__label">
          {{ progress.label }}
        </div>
        <div>
          {{ progress.info() }}
        </div>
        <br>
        <div>
          {{ progress.progressName }}: {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }}
        </div>
        <div>
          Remaining: {{ remaining }} seconds
        </div>
        <div class="l-modal-progress-bar__hbox">
          <div class="l-modal-progress-bar__bg c-modal-progress-bar__bg">
            <div class="l-modal-progress-bar__fg c-modal-progress-bar__fg" :style="foregroundStyle" />
          </div>
        </div>
        <br>
        <div class="l-modal-progress-bar__buttons">
          <offline-speedup-button
            v-for="button in buttons"
            :key="button.text"
            :button="button"
            :progress="progress"
          />
        </div>
      </div>
    </div>`,
});
