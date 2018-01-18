import { wizardReducer } from '../';

const emptyWizard = {
  currentSlide: 0,
  totalSlides: 0,
  slides: {},
  hasIntro: false,
  hasOutro: false,
};

describe('core.webapp -> reducers -> wizardReducer', () => {
  describe('@@WIZARD/INIT', () => {
    it('success', () => {
      expect(
        wizardReducer(emptyWizard, {
          type: '@@WIZARD/INIT',
          value: { state: { hasIntro: true } },
        }),
      ).toEqual({ ...emptyWizard, hasIntro: true, slides: {} });
    });
  });

  describe('@@WIZARD/PREV', () => {
    it('success', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, hasIntro: true },
          {
            type: '@@WIZARD/PREV',
            value: { state: { result: true } },
          },
        ),
      ).toEqual({
        ...emptyWizard,
        hasIntro: true,
        currentSlide: -1,
        slides: { result: true },
      });
    });

    it('success w/o slide data', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, hasIntro: true },
          { type: '@@WIZARD/PREV' },
        ),
      ).toEqual({
        ...emptyWizard,
        hasIntro: true,
        currentSlide: -1,
      });
    });

    it('failure', () => {
      expect(wizardReducer(emptyWizard, { type: '@@WIZARD/PREV' })).toEqual(
        emptyWizard,
      );
    });
  });

  describe('@@WIZARD/NEXT', () => {
    it('success', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, totalSlides: 1, hasOutro: true },
          {
            type: '@@WIZARD/NEXT',
            value: { state: { result: true } },
          },
        ),
      ).toEqual({
        ...emptyWizard,
        hasOutro: true,
        totalSlides: 1,
        currentSlide: 1,
        slides: { result: true },
      });
    });

    it('success w/o slide data', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, totalSlides: 1, hasOutro: true },
          { type: '@@WIZARD/NEXT' },
        ),
      ).toEqual({
        ...emptyWizard,
        hasOutro: true,
        totalSlides: 1,
        currentSlide: 1,
      });
    });

    it('failure', () => {
      expect(wizardReducer(emptyWizard, { type: '@@WIZARD/NEXT' })).toEqual(
        emptyWizard,
      );
    });
  });

  describe('@@WIZARD/GOTO', () => {
    it('success', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, totalSlides: 3, hasOutro: true },
          {
            type: '@@WIZARD/GOTO',
            value: { slide: 2, state: { result: true } },
          },
        ),
      ).toEqual({
        ...emptyWizard,
        hasOutro: true,
        totalSlides: 3,
        currentSlide: 2,
        slides: { result: true },
      });
    });

    it('success w/o slide data', () => {
      expect(
        wizardReducer(
          { ...emptyWizard, totalSlides: 3, hasOutro: true },
          {
            type: '@@WIZARD/GOTO',
            value: { slide: 2 },
          },
        ),
      ).toEqual({
        ...emptyWizard,
        hasOutro: true,
        totalSlides: 3,
        currentSlide: 2,
      });
    });

    it('failure', () => {
      expect(
        wizardReducer(emptyWizard, {
          type: '@@WIZARD/GOTO',
          value: { slide: 2 },
        }),
      ).toEqual(emptyWizard);
    });
  });

  describe('default', () => {
    it('default state', () => {
      expect(
        wizardReducer(undefined, {
          type: '@@BRISKHOME/RANDOM',
          value: 'any',
        }),
      ).toEqual(emptyWizard);
    });

    it('random action', () => {
      expect(
        wizardReducer(emptyWizard, {
          type: '@@BRISKHOME/RANDOM',
          value: 'any',
        }),
      ).toEqual(emptyWizard);
    });
  });
});
