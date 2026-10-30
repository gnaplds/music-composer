const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
const script = html.match(/<script id="composer-core">([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({ structuredClone });
vm.runInContext(script, context);
const { createComposer, planPlayback } = context.Composer;
const plain = value => JSON.parse(JSON.stringify(value));

test('advancing into an empty box inherits collection key only within that box and supports undo', () => {
  const song=createComposer();
  song.dispatch({type:'context',kind:'collection',at:0,tonic:5,mode:'minor'});
  song.dispatch({type:'context',kind:'key',at:8,tonic:2,mode:'major'});
  const before=plain(song.inspect());
  assert.equal(song.dispatch({type:'advance',at:4}),4);
  assert.equal(song.inspect(3).context.key.tonic,0);
  assert.deepEqual(plain(song.inspect(4).context.key),{at:4,tonic:5,mode:'minor'});
  assert.equal(song.inspect(8).context.key.tonic,2);
  assert.deepEqual(plain(song.inspect().collection),before.collection);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().key),before.key);
  song.dispatch({type:'redo'});
  assert.equal(song.inspect(4).context.key.tonic,5);
});

test('piano entry inherits the collection for new boxes and automatic advance shares one undo step', () => {
  const song=createComposer();
  song.dispatch({type:'context',kind:'collection',at:0,tonic:5,mode:'minor'});
  const before=plain(song.inspect());
  const result=song.dispatch({type:'enter',part:'melody',pitch:72,start:3,duration:1});
  assert.equal(result.position,4);
  assert.equal(song.inspect(0).context.key.tonic,5);
  assert.equal(song.inspect(4).context.key.tonic,5);
  assert.equal(song.inspect(8).context.key.tonic,0);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  assert.deepEqual(plain(song.inspect().key),before.key);
  song.dispatch({type:'redo'});
  assert.equal(song.inspect(4).context.key.mode,'minor');
  song.dispatch({type:'enter',part:'chord',pitch:65,start:18,duration:1,advance:false});
  assert.equal(song.inspect().end,20);
  assert.deepEqual(plain(song.inspect(18).context.key),{at:16,tonic:5,mode:'minor'});
  assert.equal(song.inspect(20).context.key.tonic,0);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().end,16);
  assert.equal(song.inspect(18).context.key.tonic,0);
});

test('key inheritance preserves occupied boxes, held notes, and invalid or no-op advance history', () => {
  const song=createComposer();
  song.dispatch({type:'advance',at:4});
  assert.equal(song.inspect().canUndo,false);
  song.dispatch({type:'context',kind:'collection',at:0,tonic:5,mode:'minor'});
  song.dispatch({type:'add',part:'bass',pitch:48,start:0,duration:8});
  const before=plain(song.inspect());
  song.dispatch({type:'advance',at:4});
  assert.deepEqual(plain(song.inspect()),before);
  song.dispatch({type:'enter',part:'chord',pitch:65,start:4,duration:1,advance:false});
  assert.equal(song.inspect(4).context.key.tonic,0);
  const occupied=plain(song.inspect());
  for(const at of [-1,257,NaN,Infinity,.1,'4']){
    assert.throws(()=>song.dispatch({type:'advance',at}));
    assert.deepEqual(plain(song.inspect()),occupied);
  }
  song.dispatch({type:'advance',at:256});
  assert.deepEqual(plain(song.inspect()),occupied);
  song.dispatch({type:'advance',at:8});
  assert.equal(song.inspect(8).context.key.tonic,5);
  song.dispatch({type:'advance',at:8});
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().key),occupied.key);
});

test('a newly entered sustain gives every empty box it reaches the collection key without fragmenting the passage', () => {
  const song=createComposer();
  song.dispatch({type:'context',kind:'collection',at:0,tonic:5,mode:'minor'});
  song.dispatch({type:'enter',part:'bass',pitch:41,start:18,duration:8,advance:false});
  assert.equal(song.inspect().end,28);
  for(const at of [18,20,24,26])assert.equal(song.inspect(at).context.key.tonic,5);
  assert.deepEqual(plain(song.inspect().key),[
    {at:0,tonic:0,mode:'major'},{at:16,tonic:5,mode:'minor'},{at:28,tonic:0,mode:'major'},
  ]);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().end,16);
  assert.equal(song.inspect().notes.length,0);
  assert.deepEqual(plain(song.inspect().key),[{at:0,tonic:0,mode:'major'}]);
});

test('deleting a selected group removes complete notes across parts with one undo', () => {
  const song = createComposer();
  for (const note of [
    {part:'bass',pitch:48,start:0,duration:8},
    {part:'chord',pitch:64,start:2,duration:2},
    {part:'melody',pitch:72,start:3,duration:1},
  ]) song.dispatch({type:'add',...note});
  song.dispatch({type:'split',at:2});
  song.dispatch({type:'context',kind:'key',at:4,tonic:7,mode:'major'});
  const before = plain(song.inspect());
  song.dispatch({type:'delete',ids:[before.notes[0].id,before.notes[2].id]});
  const after = plain(song.inspect());
  assert.deepEqual(after.notes,[before.notes[1]]);
  assert.deepEqual(after.key,before.key);
  assert.deepEqual(after.cuts,before.cuts);
  assert.equal(after.end,before.end);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  song.dispatch({type:'redo'});
  assert.deepEqual(plain(song.inspect().notes),after.notes);
});

test('invalid group deletion leaves notes and undo history unchanged', () => {
  const song = createComposer();
  song.dispatch({type:'add',part:'chord',pitch:60,start:0,duration:2});
  const before = plain(song.inspect()), id = before.notes[0].id;
  for (const ids of [[],[id,'missing'],'not-a-selection',null]) {
    assert.throws(()=>song.dispatch({type:'delete',ids}));
    assert.deepEqual(plain(song.inspect()),before);
  }
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),[]);
});

test('moving selected notes snaps the dragged note and preserves group spacing across parts in one undo step', () => {
  const song=createComposer();
  for(const note of [
    {part:'chord',pitch:60,start:0,duration:1},
    {part:'chord',pitch:60,start:1,duration:1},
    {part:'melody',pitch:72,start:1/3,duration:2/3},
    {part:'bass',pitch:48,start:0,duration:4},
  ])song.dispatch({type:'add',...note});
  const before=plain(song.inspect()), ids=before.notes.slice(0,3).map(note=>note.id);
  const action={type:'move',id:ids[0],ids,start:16.2,snap:1};
  const preview=plain(song.dispatch({...action,preview:true}));
  assert.deepEqual(preview.map(note=>[note.part,note.pitch,note.start,note.duration]),[
    ['chord',60,16,1],['chord',60,17,1],['melody',72,392/24,2/3],
  ]);
  assert.deepEqual(plain(song.inspect()),before);
  song.dispatch(action);
  assert.deepEqual(plain(song.inspect().notes).slice(0,3).map(note=>note.start),[16,17,392/24]);
  assert.deepEqual(plain(song.inspect().notes[3]),before.notes[3]);
  assert.equal(song.inspect().end,20);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  assert.equal(song.inspect().end,16);
  song.dispatch({type:'redo'});
  assert.equal(song.inspect().notes[0].start,16);
  const after=plain(song.inspect());
  for(const invalid of [{id:ids[1],start:0},{start:255},{ids:[]},{ids:[ids[0],'missing']},{snap:.25}]){
    assert.throws(()=>song.dispatch({...action,...invalid}));
    assert.deepEqual(plain(song.inspect()),after);
  }
});

test('resizing selected notes adds one snapped duration offset and rejects the entire invalid edit', () => {
  const song=createComposer();
  for(const note of [
    {part:'chord',pitch:60,start:0,duration:1},
    {part:'melody',pitch:72,start:1/3,duration:2/3},
    {part:'bass',pitch:48,start:0,duration:4},
    {part:'chord',pitch:60,start:3,duration:1},
  ])song.dispatch({type:'add',...note});
  const before=plain(song.inspect()), ids=before.notes.slice(0,2).map(note=>note.id);
  const action={type:'resize',id:ids[0],ids,end:2.2,snap:1};
  const preview=plain(song.dispatch({...action,preview:true}));
  assert.deepEqual(preview.map(note=>[note.start,note.duration]),[[0,2],[1/3,40/24]]);
  assert.deepEqual(plain(song.inspect()),before);
  song.dispatch(action);
  assert.deepEqual(plain(song.inspect().notes).slice(0,2).map(note=>[note.start,note.duration]),[[0,2],[1/3,40/24]]);
  assert.deepEqual(plain(song.inspect().notes).slice(2),before.notes.slice(2));
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  song.dispatch({type:'redo'});
  const after=plain(song.inspect());
  for(const invalid of [{end:1/3,snap:1/3},{end:4},{end:257},{end:NaN},{ids:[]},{ids:[ids[0],'missing']},{snap:.25}]){
    for(const preview of [true,false]){
      assert.throws(()=>song.dispatch({...action,...invalid,preview}));
      assert.deepEqual(plain(song.inspect()),after);
    }
  }
  song.dispatch({...action,end:3}); // Adjacent notes may share an end/start boundary.
  const adjacent=plain(song.inspect());
  const samePitchIds=adjacent.notes.filter(note=>note.part==='chord').map(note=>note.id);
  assert.throws(()=>song.dispatch({...action,ids:samePitchIds,end:4}),/overlap/i);
  assert.deepEqual(plain(song.inspect()),adjacent);
  assert.throws(()=>song.dispatch({type:'move',id:ids[0],ids,start:1,snap:1}),/overlap/i);
  assert.deepEqual(plain(song.inspect()),adjacent);
});

test('changing the key of selected boxes preserves every unselected passage and undoes as one edit', () => {
  const song=createComposer();
  song.dispatch({type:'add',part:'chord',pitch:60,start:0,duration:16});
  for(const [at,tonic,mode] of [[2,2,'minor'],[6,7,'major'],[10,9,'minor'],[12,5,'major']])song.dispatch({type:'context',kind:'key',at,tonic,mode});
  const before=plain(song.inspect());
  song.dispatch({type:'key-boxes',boxes:[{start:8,end:12},{start:0,end:4}],tonic:3,mode:'major'});
  for(const [at,tonic,mode] of [[0,3,'major'],[3,3,'major'],[4,2,'minor'],[6,7,'major'],[8,3,'major'],[11,3,'major'],[12,5,'major'],[15,5,'major']]){
    const key=song.inspect(at).context.key;
    assert.deepEqual([key.tonic,key.mode],[tonic,mode]);
  }
  for(const field of ['notes','collection','meter','cuts','end'])assert.deepEqual(plain(song.inspect()[field]),before[field]);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().key),before.key);
  song.dispatch({type:'redo'});
  assert.equal(song.inspect(10).context.key.tonic,3);
  const after=plain(song.inspect());
  for(const invalid of [{boxes:[]},{boxes:[{start:1,end:4}]},{boxes:[{start:0,end:5}]},{tonic:12},{mode:'other'}]){
    assert.throws(()=>song.dispatch({type:'key-boxes',boxes:[{start:0,end:4}],tonic:3,mode:'major',...invalid}));
    assert.deepEqual(plain(song.inspect()),after);
  }
});

test('box inspection follows exact boundaries through silence, splits, and meter changes', () => {
  const song=createComposer();
  song.dispatch({type:'split',at:1});
  song.dispatch({type:'context',kind:'meter',at:2,n:3,d:4});
  song.dispatch({type:'context',kind:'key',at:2.5,tonic:7,mode:'major'});
  for(const [at,start,end] of [[0,0,1],[1,1,2],[2,2,4],[2.5,2,4],[4,4,5]]){
    assert.deepEqual(plain(song.inspect(at).activeBox),{start,end});
  }
  assert.equal(song.inspect(song.inspect().end).activeBox,null);
});

test('adjacent selected boxes share one key passage and the final box restores context for later song extension', () => {
  const song=createComposer();
  song.dispatch({type:'split',at:2});
  song.dispatch({type:'key-boxes',boxes:[{start:0,end:2},{start:2,end:4},{start:4,end:8}],tonic:7,mode:'major'});
  assert.deepEqual(plain(song.inspect().key),[{at:0,tonic:7,mode:'major'},{at:8,tonic:0,mode:'major'}]);
  song.dispatch({type:'key-boxes',boxes:[{start:12,end:16}],tonic:9,mode:'minor'});
  song.dispatch({type:'add',part:'bass',pitch:48,start:16,duration:4});
  assert.equal(song.inspect(15).context.key.tonic,9);
  assert.deepEqual(plain(song.inspect(16).context.key),{at:16,tonic:0,mode:'major'});
});

test('same-pitch entry and edits reject overlaps within one part but allow adjacent notes, octaves, and other parts', () => {
  const song=createComposer();
  song.dispatch({type:'add',part:'chord',pitch:60,start:1,duration:2});
  song.dispatch({type:'add',part:'chord',pitch:62,start:0,duration:2});
  const before=plain(song.inspect()), second=before.notes[1].id;
  for(const note of [{start:1,duration:2},{start:0,duration:2},{start:2,duration:2},{start:0,duration:4},{start:1.5,duration:.5}]){
    assert.throws(()=>song.dispatch({type:'enter',part:'chord',pitch:60,...note}),/overlap/i);
    assert.deepEqual(plain(song.inspect()),before);
  }
  assert.throws(()=>song.dispatch({type:'edit',id:second,pitch:60}),/overlap/i);
  assert.deepEqual(plain(song.inspect()),before);
  song.dispatch({type:'add',part:'chord',pitch:60,start:0,duration:1});
  song.dispatch({type:'add',part:'chord',pitch:60,start:3,duration:1});
  song.dispatch({type:'add',part:'chord',pitch:72,start:1,duration:2});
  song.dispatch({type:'add',part:'bass',pitch:60,start:1,duration:2});
  assert.equal(song.inspect().notes.length,6);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().notes.length,5);
  const triplets=createComposer();
  let at=0;
  for(let i=0;i<9;i++)at=triplets.dispatch({type:'enter',part:'melody',pitch:72,start:at,duration:2/3}).position;
  assert.equal(at,6);
  assert.equal(triplets.inspect().notes.length,9);
});

test('move and resize previews reject same-pitch collisions before changing state or undo history', () => {
  const song=createComposer();
  for(const start of [0,3])song.dispatch({type:'add',part:'melody',pitch:72,start,duration:1});
  const before=plain(song.inspect()), id=before.notes[0].id;
  for(const action of [{type:'move',id,start:3,snap:1},{type:'resize',id,end:4,snap:1}]){
    for(const preview of [true,false]){
      assert.throws(()=>song.dispatch({...action,preview}),/overlap/i);
      assert.deepEqual(plain(song.inspect()),before);
    }
  }
  song.dispatch({type:'resize',id,end:3,snap:1});
  assert.equal(song.inspect().notes[0].duration,3);
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
});

test('piano deletion removes only the complete matching note active in the selected part and undoes once', () => {
  const song=createComposer();
  for(const note of [
    {part:'chord',pitch:60,start:0,duration:4},
    {part:'chord',pitch:60,start:4,duration:1},
    {part:'chord',pitch:64,start:0,duration:4},
    {part:'bass',pitch:60,start:0,duration:4},
  ])song.dispatch({type:'add',...note});
  const before=plain(song.inspect());
  assert.equal(song.dispatch({type:'delete-at',part:'chord',pitch:60,at:2}),true);
  assert.deepEqual(plain(song.inspect().notes),before.notes.slice(1));
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  song.dispatch({type:'delete-at',part:'chord',pitch:60,at:4});
  assert.deepEqual(plain(song.inspect().notes),before.notes.filter((_,i)=>i!==1));
  const after=plain(song.inspect());
  assert.equal(song.dispatch({type:'delete-at',part:'chord',pitch:60,at:5}),false);
  assert.deepEqual(plain(song.inspect()),after);
  for(const invalid of [{part:'other'}, {pitch:128}, {at:NaN}])assert.throws(()=>song.dispatch({type:'delete-at',part:'chord',pitch:60,at:0,...invalid}));
  song.dispatch({type:'undo'});
  assert.deepEqual(plain(song.inspect().notes),before.notes);
});

test('quarter-triplet snap is supported for seeking, moving, and resizing while sixteenth snap is rejected', () => {
  const song=createComposer();
  song.dispatch({type:'add',part:'chord',pitch:60,start:0,duration:1});
  const id=song.inspect().notes[0].id;
  assert.equal(song.dispatch({type:'seek',at:1.1,snap:2/3,tolerance:0}),4/3);
  assert.equal(song.dispatch({type:'move',id,start:1.1,snap:2/3,preview:true}).start,4/3);
  song.dispatch({type:'move',id,start:1.1,snap:2/3});
  assert.equal(song.dispatch({type:'resize',id,end:2.5,snap:2/3,preview:true}).duration,4/3);
  song.dispatch({type:'resize',id,end:2.5,snap:2/3});
  assert.equal(song.inspect().notes[0].duration,4/3);
  for(const action of [{type:'seek',at:1,tolerance:0},{type:'move',id,start:1},{type:'resize',id,end:3}]){
    assert.throws(()=>song.dispatch({...action,snap:.25}));
  }
});

test('cursor inspection includes note starts and held notes in every part, and excludes exact note ends without editing', () => {
  const song=createComposer();
  for(const note of [
    {part:'bass',pitch:48,start:0,duration:4},
    {part:'chord',pitch:64,start:1,duration:2},
    {part:'melody',pitch:72,start:1,duration:1},
    {part:'melody',pitch:74,start:2,duration:1},
  ])song.dispatch({type:'add',...note});
  const before=plain(song.inspect());
  for(const [at,pitches] of [[0,[48]],[1,[48,64,72]],[1.5,[48,64,72]],[2,[48,64,74]],[3,[48]],[4,[]]]){
    assert.deepEqual(plain(song.inspect(at).active).map(note=>note.pitch),pitches);
  }
  assert.deepEqual(plain(song.inspect()),before);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().notes.length,3);
});

test('Roman display separates vertical inversion figures from secondary-target slashes and added sixths', () => {
  for(const [pitches,name,roman,expected] of [
    [[52,60,67],'C/E','I6',{prefix:'I',figures:['6'],suffix:'',text:'I (6)'}],
    [[55,60,64],'C/G','I6/4',{prefix:'I',figures:['6','4'],suffix:'',text:'I (6 over 4)'}],
    [[52,58,60,67],'C7/E','V6/5/IV',{prefix:'V',figures:['6','5'],suffix:'/IV',text:'V (6 over 5)/IV'}],
    [[55,58,60,64],'C7/G','I4/3',{prefix:'I',figures:['4','3'],suffix:'',text:'I (4 over 3)'}],
    [[58,60,64,67],'C7/B♭','I4/2',{prefix:'I',figures:['4','2'],suffix:'',text:'I (4 over 2)'}],
    [[53,56,59,61],'D♭7/F','subV6/5/I',{prefix:'subV',figures:['6','5'],suffix:'/I',text:'subV (6 over 5)/I'}],
    [[48,53,56],'Fm/C','iv6/4 · Aeolian',{prefix:'iv',figures:['6','4'],suffix:' · Aeolian',text:'iv (6 over 4) · Aeolian'}],
    [[45,60,64,67],'C6/A','I(add6) [bass A]',{prefix:'I(add6) [bass A]',figures:[],suffix:'',text:'I(add6) [bass A]'}],
  ]){
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    song.dispatch({type:'label',at:0,name,custom:false,roman});
    assert.deepEqual(plain(song.inspect().harmony.romanDisplay),expected);
    assert.deepEqual(plain(song.inspect().harmony.romanReadings.find(reading=>reading.label===roman).display),expected);
  }
  const custom=createComposer();
  custom.dispatch({type:'label',at:0,name:'Custom I6/4',custom:true});
  assert.equal(custom.inspect().harmony.romanDisplay,null);
});

test('modal interchange offers every compatible parallel mode and remembers a source without changing the music', () => {
  for(const [pitches,keyMode,sources] of [
    [[53,56,60],'major',['Phrygian','Aeolian','Locrian']],
    [[58,62,65],'major',['Dorian','Mixolydian','Aeolian']],
    [[50,54,57],'major',['Lydian']],
    [[49,53,56],'major',['Phrygian','Locrian']],
    [[48,52,55],'minor',['Ionian','Lydian','Mixolydian']],
    [[48,52,55],'major',[]], [[53,56,60],'minor',[]], [[48,52,56],'major',[]],
  ]){
    const song=createComposer();
    song.dispatch({type:'context',kind:'key',at:0,tonic:0,mode:keyMode});
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    const readings=song.inspect().harmony.romanReadings.filter(option=>option.kind==='Modal interchange');
    assert.deepEqual(plain(readings).map(option=>option.label.split(' · ')[1]),sources);
  }
  const song=createComposer();
  for(const pitch of [48,53,56])song.dispatch({type:'add',part:'chord',pitch,start:0,duration:8});
  const before=plain(song.inspect());
  song.dispatch({type:'label',at:0,name:'Fm/C',custom:false,roman:'iv6/4 · Aeolian'});
  assert.equal(song.inspect(6).harmony.roman,'iv6/4 · Aeolian');
  assert.match(song.inspect().harmony.romanReadings.find(option=>option.label==='iv6/4 · Aeolian').detail,/C Aeolian/);
  for(const field of ['notes','key','collection'])assert.deepEqual(plain(song.inspect()[field]),before[field]);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().harmony.roman,'iv6/4');
  song.dispatch({type:'redo'});
  song.dispatch({type:'context',kind:'key',at:4,tonic:0,mode:'minor'});
  assert.equal(song.inspect(2).harmony.roman,'iv6/4 · Aeolian');
  assert.equal(song.inspect(5).harmony.roman,'iv6/4');
  assert.equal(song.inspect(5).harmony.romanNeedsReview,true);
});

test('diminished readings retain alternative roots and inversion figures without claiming passing or common-tone roles', () => {
  const song=createComposer();
  for(const pitch of [48,51,54,57])song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
  const notes=plain(song.inspect().notes);
  for(const [name,reading] of [
    ['Cdim7','vii°7/♭II'],['E♭dim7/C','vii°4/2/III'],
    ['G♭dim7/C','vii°4/3/V'],['Adim7/C','vii°6/5/♭VII'],
  ]){
    song.dispatch({type:'label',at:0,name,custom:false});
    assert.ok(song.inspect().harmony.romanOptions.includes(reading));
    song.dispatch({type:'label',at:0,name,custom:false,roman:reading});
    assert.equal(song.inspect().harmony.roman,reading);
  }
  assert.deepEqual(plain(song.inspect().notes),notes);
  assert.equal(song.inspect().harmony.romanReadings.some(option=>/passing|common-tone/i.test(option.kind)),false);
  for(const pitches of [[50,53,56],[50,53,56,60]]){
    const dim=createComposer();
    for(const pitch of pitches)dim.dispatch({type:'add',part:'chord',pitch,start:0,duration:1});
    const expected=pitches.length===3?'vii°/♭III':'viiø7/♭III';
    const reading=dim.inspect().harmony.romanReadings.find(option=>option.label===expected);
    assert.equal(reading?.kind,'Leading-tone diminished');
    if(pitches.length===4)assert.match(reading.detail,/less usual/i);
  }
});

test('tritone substitutes target a semitone below the root, including the tonic, and retain inversions', () => {
  for(const [pitches,options] of [
    [[49,53,56,59],['subV7/I','subV7/i']],
    [[54,58,61,64],['subV7/IV','subV7/iv']],
    [[55,59,62,65],['subV7/♭V','subV7/♭v']],
    [[53,56,59,61],['subV6/5/I','subV6/5/i']],
  ]){
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    const readings=song.inspect().harmony.romanReadings.filter(option=>option.kind==='Tritone substitute');
    assert.deepEqual(plain(readings).map(option=>option.label),options);
    song.dispatch({type:'label',at:0,name:song.inspect().harmony.suggested,custom:false,roman:options[0]});
    assert.equal(song.inspect().harmony.roman,options[0]);
    song.dispatch({type:'undo'});
    assert.notEqual(song.inspect().harmony.roman,options[0]);
  }
  const majorSeventh=createComposer();
  for(const pitch of [49,53,56,60])majorSeventh.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
  assert.equal(majorSeventh.inspect().harmony.romanReadings.some(option=>option.kind==='Tritone substitute'),false);
});

test('secondary choices reach every chromatic major and minor target and retain Roman inversion figures', () => {
  const targets=['IV','♭V','V','♭VI','VI','♭VII','VII',null,'♭II','II','♭III','III'];
  for(let root=0;root<12;root++){
    const song=createComposer();
    for(const interval of [0,4,7,10])song.dispatch({type:'add',part:'chord',pitch:48+root+interval,start:0,duration:4});
    const choices=song.inspect().harmony.romanOptions.filter(label=>label.startsWith('V7/'));
    assert.deepEqual(plain(choices).sort(),targets[root]?[`V7/${targets[root]}`,`V7/${targets[root].toLowerCase()}`].sort():[]);
  }
  const inverted=createComposer();
  for(const pitch of [52,58,60,67])inverted.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
  assert.ok(inverted.inspect().harmony.romanOptions.includes('V6/5/IV'));
  const reading=inverted.inspect().harmony.romanReadings.find(option=>option.label==='V6/5/IV');
  assert.equal(reading.kind,'Secondary dominant');
  assert.match(reading.detail,/F major/);
  inverted.dispatch({type:'label',at:0,name:'C7/E',custom:false,roman:'V6/5/IV'});
  assert.equal(inverted.inspect().harmony.roman,'V6/5/IV');
});

test('sixth and suspended readings keep their quality and identify the bass without inversion figures', () => {
  for(const [pitches,name,expected] of [
    [[52,55,57,60],'C6/E','I(add6) [bass E]'],
    [[55,60,62],'Csus2/G','Isus2 [bass G]'],
    [[45,60,63,67],'Cm6/A','i(add6) [bass A]'],
  ]){
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    song.dispatch({type:'label',at:0,name,custom:false});
    assert.equal(song.inspect().harmony.roman,expected);
  }
});

test('recognition limits chord types without restricting open voicings or removing extended notes', () => {
  for(const pitches of [[48,64,67,70,74],[48,64,67,71,74],[48,63,67,70,74],[48,62,64,67,69],[48,61,64,67,70]]){
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    assert.equal(song.inspect().harmony.suggested,null);
    assert.deepEqual(plain(song.inspect().notes).map(note=>note.pitch),pitches);
  }
  const open=createComposer();
  for(const pitch of [48,67,76,82])open.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
  assert.equal(open.inspect().harmony.suggested,'C7');
});

test('Roman inversion figures use the actual lowest pitch across bass and chord roles', () => {
  const cases = [
    [[52,60,67], 'I6'], [[55,60,64], 'I6/4'],
    [[52,58,60,67], 'I6/5'], [[55,58,60,64], 'I4/3'], [[58,60,64,67], 'I4/2'],
    [[51,60,67], 'i6'], [[52,59,60,67], 'Imaj6/5'],
  ];
  for(const [pitches, expected] of cases){
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    song.dispatch({type:'add',part:'bass',pitch:72,start:0,duration:4});
    assert.equal(song.inspect().harmony.roman,expected);
  }
});

test('unsuitable secondary choices are marked for review and returning to ordinary degrees follows later keys', () => {
  const song=createComposer();
  for(const pitch of [48,52,55,58])song.dispatch({type:'add',part:'chord',pitch,start:0,duration:8});
  song.dispatch({type:'label',at:0,name:'C7',custom:false,roman:'V7/IV'});
  song.dispatch({type:'context',kind:'key',at:4,tonic:5,mode:'major'});
  assert.equal(song.inspect(2).harmony.roman,'V7/IV');
  assert.equal(song.inspect(5).harmony.roman,'V7');
  assert.equal(song.inspect(5).harmony.romanNeedsReview,true);
  song.dispatch({type:'label',at:5,name:'C7',custom:false,roman:'V7'});
  assert.equal(song.inspect(2).harmony.roman,'V7/IV');
  assert.equal(song.inspect(5).harmony.romanNeedsReview,false);
  song.dispatch({type:'context',kind:'key',at:6,tonic:7,mode:'major'});
  assert.equal(song.inspect(6).harmony.roman,'IV7');
  assert.equal(song.inspect(6).harmony.romanNeedsReview,false);
  const seventh=song.inspect().notes.find(note=>note.pitch===58);
  song.dispatch({type:'edit',id:seventh.id,pitch:59});
  assert.equal(song.inspect(2).harmony.roman,'Imaj7');
  assert.equal(song.inspect(2).harmony.romanNeedsReview,true);
});

test('choosing a secondary interpretation follows the harmony across boxes without rewriting notes, and undoes once', () => {
  const song=createComposer();
  for(const pitch of [48,52,55,58])song.dispatch({type:'add',part:'chord',pitch,start:0,duration:8});
  song.dispatch({type:'split',at:2});
  const before=plain(song.inspect());
  song.dispatch({type:'label',at:1,name:'C7',custom:false,roman:'V7/IV'});
  assert.equal(song.inspect(0).harmony.roman,'V7/IV');
  assert.equal(song.inspect(6).harmony.roman,'V7/IV');
  assert.equal(song.inspect(6).harmony.romanNeedsReview,false);
  assert.deepEqual(plain(song.inspect().notes),before.notes);
  assert.deepEqual(plain(song.inspect().key),before.key);
  song.dispatch({type:'undo'});
  assert.equal(song.inspect().harmony.roman,'I7');
  song.dispatch({type:'redo'});
  assert.equal(song.inspect().harmony.roman,'V7/IV');
  assert.throws(()=>song.dispatch({type:'label',at:1,name:'C7',custom:false,roman:'V7/ii'}));
  assert.equal(song.inspect().harmony.roman,'V7/IV');
});

test('secondary targets follow the local tonic and offer both minor v and major V in minor keys', () => {
  const examples = [
    [[50,54,57,60], ['II7','V7/v','V7/V']], [[48,52,55,58], ['I7','V7/iv']],
    [[58,62,65,68], ['♭VII7','V7/♭III']], [[51,55,58,61], ['♭III7','V7/♭VI']],
    [[53,57,60,63], ['IV7','V7/♭VII']], [[55,59,62,65], ['V7']],
  ];
  for (const [pitches, options] of examples) {
    const song=createComposer();
    song.dispatch({type:'context',kind:'key',at:0,tonic:0,mode:'minor'});
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
    for(const option of options)assert.ok(song.inspect().harmony.romanOptions.includes(option));
  }
  const song=createComposer();
  for(const pitch of [57,61,64,67])song.dispatch({type:'add',part:'chord',pitch,start:0,duration:4});
  song.dispatch({type:'context',kind:'key',at:2,tonic:7,mode:'major'});
  assert.ok(song.inspect(1).harmony.romanOptions.includes('V7/ii'));
  assert.ok(song.inspect(2).harmony.romanOptions.includes('V7/V'));
});

test('secondary dominants are possible interpretations without forcing a target chord or replacing the ordinary degree', () => {
  const examples = [
    [[48,52,55], ['I','V/IV']], [[48,52,55,58], ['I7','V7/IV']],
    [[50,54,57,60], ['II7','V7/V']], [[57,61,64,67], ['VI7','V7/ii']],
    [[55,59,62,65], ['V7']], [[54,58,61,64], ['♭V7']], [[48,52,55,59], ['Imaj7']],
  ];
  for (const [pitches, alternatives] of examples) {
    const song=createComposer();
    for(const pitch of pitches)song.dispatch({type:'add',part:'chord',pitch,start:0,duration:1});
    for(const option of alternatives)assert.ok(song.inspect().harmony.romanOptions.includes(option));
    assert.equal(song.inspect().harmony.roman,alternatives[0]);
  }
});

test('melody step entry advances to each exact note end while fixed entry builds simultaneous notes', () => {
  const song = createComposer();
  let position = 15.75;
  for (const pitch of [72,74,76]) {
    position = song.dispatch({ type: 'enter', part: 'melody', pitch, start: position, duration: 1/3 }).position;
  }
  assert.equal(position, 16.75);
  assert.deepEqual(plain(song.inspect().notes).map(note=>note.start), [15.75, 386/24, 394/24]);
  assert.equal(song.inspect().end, 20);
  const fixed = song.dispatch({ type: 'enter', part: 'melody', pitch: 79, start: position, duration: 1, advance: false });
  assert.equal(fixed.position, position);
  for (const part of ['chord','bass']) assert.equal(song.dispatch({ type: 'enter', part, pitch: 60, start: 0, duration: 4 }).position, 0);
  assert.equal(song.dispatch({ type: 'enter', part: 'bass', pitch: 48, start: 4, duration: 2, advance: true }).position, 6);
  const count = song.inspect().notes.length;
  song.dispatch({ type: 'undo' });
  assert.equal(song.inspect().notes.length, count-1);
  assert.throws(()=>song.dispatch({ type: 'enter', part: 'melody', pitch: 72, start: 256, duration: 1 }));
  assert.equal(song.inspect().notes.length, count-1);
});

test('Roman labels retain major-reference accidentals in minor and distinguish diminished, augmented, and sixth qualities', () => {
  const examples = [
    [[48,51,55], 'i'], [[51,55,58], '♭III'], [[56,60,63], '♭VI'], [[58,62,65], '♭VII'],
    [[50,53,56], 'ii°'], [[47,50,53,56], 'vii°7'], [[50,53,56,60], 'iiø7'],
    [[55,59,63], 'V+'], [[48,51,55,57], 'i(add6)'],
  ];
  for (const [pitches, numeral] of examples) {
    const song = createComposer();
    song.dispatch({ type: 'context', kind: 'key', at: 0, tonic: 0, mode: 'minor' });
    for (const pitch of pitches) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 1 });
    assert.equal(song.inspect().harmony.roman, numeral);
  }
});

test('Roman numerals follow the chosen root, distinguish added sixths, and leave custom labels uninterpreted', () => {
  const song = createComposer();
  for (const pitch of [45, 60, 64, 67]) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 4 });
  assert.equal(song.inspect().harmony.roman, 'vi7');
  song.dispatch({ type: 'label', at: 0, name: 'C6/A', custom: false });
  assert.equal(song.inspect().harmony.roman, 'I(add6) [bass A]');
  song.dispatch({ type: 'label', at: 0, name: 'A gentle opening', custom: true });
  assert.equal(song.inspect().harmony.roman, null);
  song.dispatch({ type: 'undo' });
  assert.equal(song.inspect().harmony.roman, 'I(add6) [bass A]');
  const note = song.inspect().notes.find(note => note.pitch === 67);
  song.dispatch({ type: 'edit', id: note.id, pitch: 70 });
  assert.equal(song.inspect().harmony.chosen.valid, false);
  assert.equal(song.inspect().harmony.roman, null);
});

test('Roman numerals follow the key active inside a measure, independently of the color collection', () => {
  const song = createComposer();
  for (const pitch of [50, 53, 57, 60]) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 4 });
  assert.equal(song.inspect(0).harmony.roman, 'ii7');
  song.dispatch({ type: 'context', kind: 'collection', at: 1, tonic: 5, mode: 'minor' });
  assert.equal(song.inspect(1).harmony.roman, 'ii7');
  song.dispatch({ type: 'context', kind: 'key', at: 2, tonic: 2, mode: 'minor' });
  assert.equal(song.inspect(2).harmony.roman, 'i7');
  assert.equal(song.inspect(1).harmony.roman, 'ii7');
  assert.equal(song.inspect(4).harmony.roman, null);
});

test('seeking snaps to nearby starts and ends in any part, or the rhythm grid, without editing music or undo history', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 1/3, duration: 1 });
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 4, duration: .5 });
  const before = plain(song.inspect());
  const seek = at => song.dispatch({ type: 'seek', at, snap: 1, tolerance: .125 });
  assert.equal(seek(.39), 1/3);
  assert.equal(seek(1.3), 4/3);
  assert.equal(seek(4.57), 4.5);
  assert.equal(seek(2.12), 2);
  assert.equal(seek(-2), 0);
  assert.equal(seek(20), 16);
  assert.throws(() => seek(NaN));
  assert.deepEqual(plain(song.inspect()), before);
  song.dispatch({ type: 'undo' });
  assert.equal(song.inspect().notes.length, 1);
});

test('moving a note snaps its start across measures without changing its part, pitch, length, or other notes', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'chord', pitch: 64, start: 1/3, duration: 4 });
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  const before = plain(song.inspect().notes), id = before[0].id;
  const action = { type: 'move', id, start: 15.37, snap: .5 };
  assert.deepEqual(plain(song.dispatch({ ...action, preview: true })), { ...before[0], start: 15.5 });
  assert.deepEqual(plain(song.inspect().notes), before);
  song.dispatch(action);
  assert.deepEqual(plain(song.inspect().notes), [{ ...before[0], start: 15.5 }, before[1]]);
  assert.equal(song.inspect().end, 20);
  song.dispatch({ type: 'undo' });
  assert.deepEqual(plain(song.inspect().notes), before);
  assert.equal(song.inspect().end, 16);
  song.dispatch({ type: 'redo' });
  assert.equal(song.inspect().notes[0].start, 15.5);
  assert.equal(song.dispatch({ type: 'move', id, start: -.1, snap: 1, preview: true }).start, 0);
  assert.equal(song.dispatch({ type: 'move', id, start: 1.6, snap: 1/3, preview: true }).start, 5/3);
  assert.throws(() => song.dispatch({ type: 'move', id, start: 254, snap: 1 }));
  assert.equal(song.inspect().notes[0].start, 15.5);
});

test('a bass can hold while melody notes move independently', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 0, duration: 1 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 74, start: 1, duration: 1 });
  assert.deepEqual(plain(song.inspect().notes).map(({ part, pitch, start, duration }) => ({ part, pitch, start, duration })), [
    { part: 'bass', pitch: 48, start: 0, duration: 8 },
    { part: 'melody', pitch: 72, start: 0, duration: 1 },
    { part: 'melody', pitch: 74, start: 1, duration: 1 },
  ]);
});

test('splitting and merging a box changes organization without moving a held note', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  song.dispatch({ type: 'split', at: 2 });
  assert.deepEqual(plain(song.inspect().measures[0].boxes), [{ start: 0, end: 2 }, { start: 2, end: 4 }]);
  song.dispatch({ type: 'merge', at: 2 });
  assert.deepEqual(plain(song.inspect().measures[0].boxes), [{ start: 0, end: 4 }]);
  assert.equal(song.inspect().notes[0].duration, 8);
});

test('editing a selected held note changes the whole event and can be undone, redone, or deleted', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'chord', pitch: 60, start: 0, duration: 8 });
  const id = song.inspect().notes[0].id;
  song.dispatch({ type: 'edit', id, pitch: 62, start: 0, duration: 8 });
  assert.equal(song.inspect(4).notes[0].pitch, 62);
  song.dispatch({ type: 'undo' });
  assert.equal(song.inspect().notes[0].pitch, 60);
  song.dispatch({ type: 'redo' });
  assert.equal(song.inspect().notes[0].pitch, 62);
  song.dispatch({ type: 'delete', id });
  assert.equal(song.inspect().notes.length, 0);
  song.dispatch({ type: 'undo' });
  assert.deepEqual(plain(song.inspect().notes[0]), { id, part: 'chord', pitch: 62, start: 0, duration: 8 });
});

test('a meter change at quarter position two creates a short measure without moving music', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 4, duration: 1 });
  song.dispatch({ type: 'context', kind: 'meter', at: 2, n: 3, d: 4 });
  assert.deepEqual(plain(song.inspect().measures.slice(0, 3)).map(({ start, end }) => [start, end]), [[0, 2], [2, 5], [5, 8]]);
  assert.deepEqual(plain(song.inspect().notes).map(({ start, duration }) => [start, duration]), [[0, 8], [4, 1]]);
  assert.deepEqual(plain(song.inspect().measures[1].boxes), [{ start: 2, end: 4 }, { start: 4, end: 5 }]);
});

test('held E changes color with the collection while key and written notes remain independent', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'chord', pitch: 64, start: 0, duration: 8 });
  song.dispatch({ type: 'context', kind: 'key', at: 1, tonic: 7, mode: 'major' });
  song.dispatch({ type: 'context', kind: 'collection', at: 2, tonic: 5, mode: 'major' });
  song.dispatch({ type: 'context', kind: 'collection', at: 4, tonic: 0, mode: 'minor' });
  assert.equal(song.inspect(1).families[4], 'sixth');
  assert.equal(song.inspect(2).families[4], 'diminished');
  assert.equal(song.inspect(4).families[4], 'outside');
  assert.equal(song.inspect(4).context.key.tonic, 7);
  assert.deepEqual(plain(song.inspect(4).active).map(({ pitch, start, duration }) => [pitch, start, duration]), [[64, 0, 8]]);
});

test('a note beyond the song end adds complete measures and undo restores the previous length', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 15, duration: 3 });
  assert.equal(song.inspect().measures.at(-1).end, 20);
  song.dispatch({ type: 'undo' });
  assert.equal(song.inspect().measures.at(-1).end, 16);
});

test('recognition excludes melody and prefers the actual bass while offering an alternative name', () => {
  const song = createComposer();
  for (const pitch of [64, 67, 69]) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 8 });
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 74, start: 0, duration: 1 });
  assert.equal(song.inspect(0).harmony.suggested, 'C6');
  assert.equal(song.inspect(2).harmony.suggested, 'C6');
  const bass = song.inspect().notes.find(note => note.part === 'bass');
  song.dispatch({ type: 'edit', id: bass.id, pitch: 45 });
  song.dispatch({ type: 'add', part: 'chord', pitch: 60, start: 0, duration: 8 });
  assert.equal(song.inspect(2).harmony.suggested, 'Am7');
  assert.ok(song.inspect(2).harmony.alternatives.includes('C6/A'));
});

test('the agreed triad, sixth, and seventh vocabulary recognizes its C-root piano examples', () => {
  const examples = [
    ['C', [60, 64, 67]], ['Cm', [60, 63, 67]], ['Cdim', [60, 63, 66]], ['Caug', [60, 64, 68]],
    ['Csus2', [60, 62, 67]], ['Csus4', [60, 65, 67]], ['C6', [60, 64, 67, 69]], ['Cm6', [60, 63, 67, 69]],
    ['C7', [60, 64, 67, 70]], ['Cmaj7', [60, 64, 67, 71]], ['Cm7', [60, 63, 67, 70]], ['Cm(maj7)', [60, 63, 67, 71]],
    ['Cm7♭5', [60, 63, 66, 70]], ['Cdim7', [60, 63, 66, 69]],
  ];
  for (const [name, pitches] of examples) {
    const song = createComposer();
    for (const pitch of pitches) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 1 });
    assert.equal(song.inspect().harmony.suggested, name);
  }
});

test('choosing a name after a collection change leaves the earlier interpretation and notes intact', () => {
  const song = createComposer();
  for (const pitch of [45, 60, 64, 67]) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 8 });
  const original = plain(song.inspect().notes);
  song.dispatch({ type: 'label', at: 0, name: 'C6/A', custom: false });
  song.dispatch({ type: 'context', kind: 'collection', at: 4, tonic: 5, mode: 'major' });
  song.dispatch({ type: 'label', at: 5, name: 'Am7', custom: false });
  assert.equal(song.inspect(2).harmony.chosen.name, 'C6/A');
  assert.equal(song.inspect(6).harmony.chosen.name, 'Am7');
  assert.deepEqual(plain(song.inspect().notes), original);
});

test('a label cannot silently describe changed notes as an exact match', () => {
  for (const custom of [false, true]) {
    const song = createComposer();
    for (const pitch of [60, 64, 67, 69]) song.dispatch({ type: 'add', part: 'chord', pitch, start: 0, duration: 4 });
    song.dispatch({ type: 'label', at: 0, name: custom ? 'Home' : 'C6', custom });
    const note = song.inspect().notes.find(note => note.pitch === 64);
    song.dispatch({ type: 'edit', id: note.id, pitch: 65 });
    const chosen = song.inspect().harmony.chosen;
    assert.equal(chosen.needsReview, true);
    assert.equal(chosen.valid, false);
    assert.equal(chosen.name, custom ? 'Home' : 'C6');
  }
});

test('invalid edits cannot corrupt the composition or create an invalid measure loop', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 4 });
  const before = plain(song.inspect());
  const invalid = [
    { type: 'add', part: 'bass', pitch: 128, start: 0, duration: 1 },
    { type: 'add', part: 'bass', pitch: 48, start: 0, duration: -1 },
    { type: 'edit', id: before.notes[0].id, start: NaN },
    { type: 'context', kind: 'meter', at: 2, n: 0, d: 4 },
    { type: 'context', kind: 'collection', at: 0, tonic: 13, mode: 'major' },
    { type: 'split', at: 0 }, { type: 'merge', at: 4 },
  ];
  for (const action of invalid) {
    assert.throws(() => song.dispatch(action));
    assert.deepEqual(plain(song.inspect()), before);
  }
});

test('playback starts inside a held note and releases every voice at the loop end', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'bass', pitch: 48, start: 0, duration: 8 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 3, duration: 0.5 });
  song.dispatch({ type: 'add', part: 'melody', pitch: 74, start: 4, duration: 1 });
  const before = plain(song.inspect());
  const plan = planPlayback(song.inspect(), { from: 2, to: 4, bpm: 120 });
  assert.deepEqual(plain(plan.notes).map(({ pitch, start, duration, continued }) => ({ pitch, start, duration, continued })), [
    { pitch: 48, start: 0, duration: 1, continued: true },
    { pitch: 72, start: 0.5, duration: 0.25, continued: false },
  ]);
  assert.equal(plan.duration, 1);
  assert.deepEqual(plain(planPlayback(song.inspect(), { from: 2, to: 4, bpm: 120 })), plain(plan));
  assert.deepEqual(plain(song.inspect()), before);
});

test('a snapped resize previews from a triplet onset and commits as one undo step', () => {
  const song = createComposer();
  song.dispatch({ type: 'add', part: 'melody', pitch: 72, start: 1/3, duration: 1/3 });
  const original = plain(song.inspect().notes[0]);
  const gesture = { type: 'resize', id: original.id, end: 1.7, snap: .5 };
  const preview = song.dispatch({ ...gesture, preview: true });
  assert.equal(preview.start, 1/3);
  assert.equal(preview.duration, 1.5);
  assert.deepEqual(plain(song.inspect().notes[0]), original);
  song.dispatch(gesture);
  assert.deepEqual(plain(song.inspect().notes[0]), { ...original, duration: 1.5 });
  song.dispatch({ type: 'undo' });
  assert.deepEqual(plain(song.inspect().notes[0]), original);
});

test('note length readouts use musical names or exact fractions instead of decimal quarters', () => {
  const song = createComposer();
  for (const [i,duration] of [1, 1.5, 1/3, 2/3, 1.25].entries()) song.dispatch({ type: 'add', part: 'chord', pitch: 60, start: i*2, duration });
  const view = song.inspect();
  assert.deepEqual(view.notes.map(note => view.lengthLabels[note.id]).join('|'), 'Quarter|Dotted quarter|Eighth triplet|Quarter triplet|5/16 of a whole note');
});

test('metronome clicks accent actual measure starts and use two dotted-quarter pulses in 6/8', () => {
  const song = createComposer();
  assert.deepEqual(plain(planPlayback(song.inspect(), { from: 0, to: 4, bpm: 120, metronome: true }).clicks), [
    { start: 0, accent: true }, { start: 0.5, accent: false }, { start: 1, accent: false }, { start: 1.5, accent: false },
  ]);
  song.dispatch({ type: 'context', kind: 'meter', at: 2, n: 6, d: 8 });
  assert.deepEqual(plain(planPlayback(song.inspect(), { from: 1.5, to: 8, bpm: 120, metronome: true }).clicks), [
    { start: 0.25, accent: true }, { start: 1, accent: false }, { start: 1.75, accent: true }, { start: 2.5, accent: false },
  ]);
  assert.deepEqual(plain(planPlayback(song.inspect(), { from: 0, to: 8, bpm: 120 }).clicks), []);
  assert.equal(song.inspect().notes.length, 0);
});
