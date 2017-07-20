block('page').content()(function() {
  return [
    {
      block: 'header'
    },
    {
      block: this.data.view
    },
    {
      block: 'footer'
    }
  ];
});
