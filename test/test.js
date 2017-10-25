QUnit.test("Ent class test", function(assert) {
    var E = new ZORPG.Ent("ent1");
    E.addCmp("cmp1");
    E.addCmp("cmp2");
    E.addCmp("cmp3");

    assert.ok(E.name === "ent1");
    assert.ok(E.hasCmp("cmp1"));
    assert.ok(E.hasCmp("cmp2"));
    assert.ok(E.hasCmp("cmp3"));
    assert.ok(E.hasAllCmp(["cmp1", "cmp2", "cmp3"]));
    assert.notOk(E.hasCmp("invalid"));
    assert.notOk(E.hasAllCmp(["inv1", "inv2", "cmp3"]));
    assert.notOk(E.hasAllCmp("notList"));

    E.removeCmp("cmp2");
    E.removeCmp("none");
    assert.notOk(E.hasOwnProperty("cmp2"));

    E.addTag("tag1");
    E.addTag("tag2");
    E.addTag("tag3");
    assert.ok(E.hasTag("tag1"));
    assert.ok(E.hasTag("tag2"));
    assert.ok(E.hasTag("tag3"));
    assert.notOk(E.hasTag("ubvakud"));
    assert.equal(E.tags.length, 3);
    assert.ok(E.hasAllTags(["tag1", "tag2", "tag3"]));
    assert.notOk(E.hasAllTags(["inv1", "inv2", "cmp3"]));
    assert.notOk(E.hasAllTags("notList"));

    E.removeTag("tag1");
    E.removeTag("none");
    assert.notOk(E.tags.indexOf("tag1") >= 0);
    assert.equal(E.tags.length, 1);

    assert.equal(E, E.addCmp("cmpA").addTag("tagA"));
    assert.ok(E.hasCmp("cmpA"));
    assert.ok(E.hasTag("tagA"));
    assert.equal(E, E.removeCmp("cmpA").removeTag("tagA"));
    assert.notOk(E.hasCmp("cmpA"));
    assert.notOk(E.hasTag("tagA"));
});

/*QUnit.test("EntGroup class test", function(assert) {
    var E = new ZORPG.EntGroup("entGrp1");
});*/