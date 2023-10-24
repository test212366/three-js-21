import * as PIXI from 'pixi.js'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

import displace from './displace.png'
import img from './download.png'

export default class Sketch {
	constructor(options) {
		
	 
 
		
		this.width = window.innerWidth
		this.height = window.innerHeight
		
		this.app = new PIXI.Application({
			backgroundColor: 0x000000,
			resolution: 1,
			resizeTo: window
		})

		document.body.appendChild(this.app.view)

		this.app.view.style.width = this.width + 'px'
		this.app.view.style.height = this.height + 'px'

		this.container = new PIXI.Container()

		this.container.rotation = -0.1
		
		this.app.stage.addChild(this.container)
		this.scrollTarget = 0
		this.scroll = 0 
		this.currentScroll = 0
		this.add()
		//this.resize()
		this.setupResize()
		this.render()
		this.scrollEvent()

 

	}

	scrollEvent() {
		document.addEventListener('mousewheel', e => {
			this.scrollTarget = e.wheelDelta / 3
		})
	}


	add() {

	 


		let images = [img, img, img, img, img, img]

		this.slides = images.map(image => {
			PIXI.Sprite.from(image)
		})

		this.objs = []


		this.margin = 300
		this.wholeHeight = this.margin * this.slides.length

		this.slides.forEach((slide, i) => {
			let c = new PIXI.Container()

			let aspect = 2.7
	 
			
	
			c.pivot.x = -this.width / 2
	
			// c.pivot.y = -this.height / 2 - i*this.margin
	
	
	 
	
	
			let image = PIXI.Sprite.from(img)
	
			image.width = 1000
			image.height = image.width / aspect
			image.anchor.set(0.5)
	
			c.addChild(image)

			let uniforms = {
				uPower: 0,
				uDir: 1,
				udisplacement: PIXI.Sprite.from(displace).texture,
				umap: image.texture,
				filterMatrix: new PIXI.Matrix,

			}


			let displacementFilter = new PIXI.Filter(vertex, fragment, uniforms)

			displacementFilter.apply = function(filtermanager, input, output, e) {
				this.uniforms.filterMatrix = filtermanager.calculateSpriteMatrix(
					uniforms.filterMatrix,
					image
				)
				filtermanager.applyFilter(this, input, output, e)

			}


			image.filters = [displacementFilter]


			let mask = new PIXI.Graphics
	 
			 
	
	
			 
			// mask.moveTo(mx, my)
			// mask.lineTo(mx, -my)
			// mask.quadraticCurveTo(mx - 400, -my - 100, -mx, -my)
			// mask.lineTo(-mx, my)
			// mask.endFill()
	
			c.addChild(mask)
	
			c.mask = mask
	
			this.container.addChild(c)

			this.objs.push({mask, container: c, image, uniforms, position: i})
		})

		 


 
	}


	updateAllTheThings() {
		this.objs.forEach(slide => {
			slide.mask.clear()
			slide.mask.beginFill(0xff0000)
		 


			let mx = 400
			let my = 100
			const DISTORTION = this.scroll * 5
			const koef = 0.2

			slide.uniforms.uDir = Math.sign(DISTORTION)
			slide.uniforms.uPower = Math.abs(DISTORTION * 0.01)



			let p = [
				{
					x: mx,
					y: -my
				},
				{
					x: -mx,
					y: -my
				},
				{
					x: -mx,
					y: my
				},
				{
					x: mx,
					y: my
				},
			]
	
			if(DISTORTION < 0) {
				p[2].x += Math.abs(DISTORTION)* 0.4
				p[2].y -= Math.abs(DISTORTION)* 0.4

				p[3].x -= Math.abs(DISTORTION)* 0.4
				p[3].y -= Math.abs(DISTORTION) * 0.4
			} else {
				p[0].x -= Math.abs(DISTORTION)* 0.4
				p[0].y += Math.abs(DISTORTION)* 0.4

				p[1].x += Math.abs(DISTORTION)* 0.4
				p[1].y += Math.abs(DISTORTION) * 0.4
			}




			let C = [
				{
					x: 0.5 * p[0].x + 0.5 * p[1].x,
					y: 0.5 * p[0].y + 0.5 * p[1].y + DISTORTION
				},
				{
					x: 0.5 * p[1].x + 0.5 * p[2].x + Math.abs(DISTORTION * koef),
					y: 0.5 * p[1].y + 0.5 * p[2].y 
				},
				{
					x: 0.5 * p[2].x + 0.5 * p[3].x ,
					y: 0.5 * p[2].y + 0.5 * p[3].y + DISTORTION
				},
				{
					x: 0.5 * p[3].x + 0.5 * p[0].x - Math.abs(DISTORTION * koef),
					y: 0.5 * p[3].y + 0.5 * p[0].y  
				},
			]
	
			slide.mask.moveTo(p[0].x, p[0].y)
			slide.mask.quadraticCurveTo(C[0].x, C[0].y, p[1].x, p[1].y,)
			slide.mask.quadraticCurveTo(C[1].x, C[1].y, p[2].x, p[2].y,)
			slide.mask.quadraticCurveTo(C[2].x, C[2].y, p[3].x, p[3].y,)
			slide.mask.quadraticCurveTo(C[3].x, C[3].y, p[0].x, p[0].y,)


			slide.container.position.y = (slide.position * this.margin + this.currentScroll + 1000 * this.wholeHeight) % this.wholeHeight 
				- this.margin 
		})
	}


	setupResize() {
		window.addEventListener('resize', this.resize.bind(this))
	}

	resize() {
		this.width =window.innerWidth
		this.height = window.innerWidth
		this.app.view.style.width = this.width + 'px'
		this.app.view.style.height = this.height + 'px'
	}

	render() {
		this.app.ticker.add(delta => {
			this.scroll -= (this.scroll - this.scrollTarget) * 0.1
			this.scroll *= 0.9
			this.direction = Math.sign(this.scroll)

			this.currentScroll = this.scroll

			this.updateAllTheThings()
		})
	}
 
}
new Sketch({
	dom: document.getElementById('container')
})
 