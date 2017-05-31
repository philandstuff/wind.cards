const fingeringMap = {
    // left fingers
    'hole1':'e_hole',
    'top-e♭':'high_e♭',
    'hole2':'d_hole',
    'hole3':'c_hole',
    'low-e♭':'low_e♭',
    'low-c♯':'low_c♯',
    // right fingers
    'c♯-trill':'trill_c♯',
    'hole4':'b_hole',
    'hole5':'a_hole',
    'g':'g_key',
    'f':'f_key',
    'pinkie-f♯':'pinkie_f♯',
    'a♭':'pinkie_a♭',
    // right thumb
    'b♭':'thumb_b♭',
    'pancake':'pancake_key',
    'f♯':'thumb_f♯',
    'thumb-a♭':'thumb_a♭',    
    // left thumb
    'low-b♭':'bottom_b♭',
    'low-b':'bottom_b',
    'low-c':'bottom_c',
    'low-d':'bottom_d',
    'whisper':'whisper',
    'tuning-a':'a_key',
    'top-c':'c_key',
    'top-d':'top_d',
    'c♯':'c♯_key',
};

export function renderFingering(fingering) {
    let fingeringElement = document.getElementById('fingering');
    let svgDoc = fingeringElement.contentDocument;
    for (let svgKeyClass in fingeringMap) {
        let fingeringDataName = fingeringMap[svgKeyClass];
        let keyElement = svgDoc.getElementsByClassName(svgKeyClass)[0];
        if (fingering[fingeringDataName] === 'x') {
            keyElement.setAttribute('fill', 'black');
        }
        else if (fingering[fingeringDataName] === 'tr') {
            keyElement.setAttribute('fill', 'blue');
        }
        else if (fingering[fingeringDataName] === '/') {
            keyElement.setAttribute('fill', 'url(#half-hole)');
        }
        else {
            keyElement.removeAttribute('fill');
        }
    }
}
