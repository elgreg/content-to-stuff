'use strict';

const runAgainAfter = 2000;
const contentRegex = /(^|[^A-Z^a-z])content([^A-Z^a-z]|$)/gi;
let replacements = 0;
chrome.runtime.sendMessage({replacementCount: replacements + ''});
const replacer = function(firstRun){
    let elements = document.getElementsByTagName('*');

    // Thanks http://9to5google.com/2015/06/14/how-to-make-a-chrome-extensions/
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if(shouldIgnoreNode(element)){
            continue;
        }

        for (let j = 0; j < element.childNodes.length; j++) {
            let node = element.childNodes[j];
            if(shouldIgnoreNode(node)){
                continue;
            }

            if (node.nodeType === 3) {
                let text = node.nodeValue;
                let replacedText = text.replace(contentRegex, function(match, group1, group2) {
                    return group1 + matchCase('stuff', match, group1) + group2;
                });

                if (replacedText !== text) {
                    replacements++;
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
    if(!firstRun){
        chrome.runtime.sendMessage({replacementCount: replacements + ''});
    }
}

// Thanks: http://stackoverflow.com/questions/17264639/replace-text-but-keep-case
const matchCase = function(text, pattern, group1) {
    var result = '';
    var firstCapLength = group1 && group1.length || 0;
    for(var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        var p = pattern.charCodeAt(i+firstCapLength);

        if(p >= 65 && p < 65 + 26) {
            result += c.toUpperCase();
        } else {
            result += c.toLowerCase();
        }
    }
    return result;
}



const shouldIgnoreNode = function(node) {
    const tagsToIgnoreChildrenOf = ['head','script','link'];
    let tagName = node.tagName && node.tagName.toLowerCase();
    let parentTagName = node.parentElement && node.parentElement.tagName.toLowerCase();
    if(tagsToIgnoreChildrenOf.indexOf(tagName) !== -1 ||
       tagsToIgnoreChildrenOf.indexOf(parentTagName) !== -1){
           return true;
    }
    return false;
}


replacer(true);

// Try again
window.setTimeout(replacer, runAgainAfter);
