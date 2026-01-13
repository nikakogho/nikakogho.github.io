2 [[Artificial Neural Network|neural networks]] compete: 1 generates fake data, other tries to tell which data is real and which was AI generated.
Data can be text, images, music, video, face…

Generator keeps getting better at making undetectable fakes.
Detective gets better at spotting any mistake.
They keep competing until generator makes fake data so good the detective can’t tell anymore (this is similar to the [[Turing Test Games Between LLMs]] I experimented with).

![GAN.png](gan.png)

Made by [[Ian Goodfellow]].

## GAN Loss

Generator has its loss to push to making more plausible data.
Discriminator has a loss to get more accurate.
They end up at nash equilibrium.
![gan_loss.jpeg](gan_loss.jpeg)

### Wasserstein Distance

A discrete loss measure that means “work needed to move from one distribution to another” measured as mass times distance. Useful because other distribution distance measures go to infinite for non overlaping distributions
![Wasserstein_Distance.jpeg](wasserstein_distance.jpeg)

## Deep Convolutional GAN

Also known as DCGAN.
A GAN architecture where discriminator is a [[Convolutional Neural Network]].
![DCGAN.jpeg](dcgan.jpeg)

## Mode Collapse

* Mode Dropping - GANs sometimes only learn a subset of real data distribution and so never output some kinds of data (like never making a face with beard)
* Mode Collapse - when this goes too far and only one or few kinds of data are made

## CycleGAN

Transform existing dataset into something new, like turn a horse into a zebra or based on this music make new music or change genre of this music, and then try to map it back
![CycleGAN.jpeg](cyclegan.jpeg)

## StyleGAN

Steer high level details with w style latent vector
![StyleGAN.jpeg](stylegan.jpeg)
