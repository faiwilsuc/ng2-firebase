import { TardisUiPage } from './app.po';

describe('tardis-ui App', () => {
  let page: TardisUiPage;

  beforeEach(() => {
    page = new TardisUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
