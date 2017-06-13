#!/bin/bash

pico2wave -w /tmp/cmd.wav "$1" && aplay /tmp/cmd.wav
