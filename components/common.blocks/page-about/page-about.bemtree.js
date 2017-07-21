block('page-about').content()(function() {
  return {
    block: 'pre',
    tag: 'pre',
    content: {
      block: 'code',
      tag: 'code',
      content: JSON.stringify( this.data.api, null, 2 )
    }
  };
});
